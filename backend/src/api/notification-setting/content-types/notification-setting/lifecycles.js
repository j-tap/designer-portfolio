'use strict';

const { errors: { ValidationError } } = require('@strapi/utils');
const { splitEmails, EMAIL_RE } = require('../../../../utils/notify-recipients');
const { sendTelegram, splitList, TOKEN_RE, CHAT_RE } = require('../../../../utils/telegram');

const UID = 'api::notification-setting.notification-setting';

// Опечатку видно сразу при сохранении в админке, а не когда уведомление не придёт
function validate(data) {
  if (data.emails !== undefined) {
    const invalid = splitEmails(data.emails).filter(item => !EMAIL_RE.test(item));
    if (invalid.length) {
      throw new ValidationError(`Неверный адрес почты: ${invalid.join(', ')}. Пишите по одному адресу на строку`);
    }
  }
  if (data.telegram_bot_token) {
    data.telegram_bot_token = String(data.telegram_bot_token).trim();
    if (!TOKEN_RE.test(data.telegram_bot_token)) {
      throw new ValidationError('Ключ бота не похож на ключ от @BotFather: он выглядит как 123456789:AA…, без пробелов');
    }
  }
  if (data.telegram_chat_ids !== undefined) {
    const invalid = splitList(data.telegram_chat_ids).filter(item => !CHAT_RE.test(item));
    if (invalid.length) {
      throw new ValidationError(`Неверный номер чата Telegram: ${invalid.join(', ')}. Номер — это цифры, которые бот присылает в ответ на /start`);
    }
  }
}

// Чаты, которых не было до сохранения: в них уходит сообщение «подключено» — сразу видно, что всё работает
function newChats(before, after) {
  const old = new Set(splitList(before?.telegram_chat_ids));
  const tokenChanged = (before?.telegram_bot_token || '') !== (after?.telegram_bot_token || '');
  return splitList(after?.telegram_chat_ids).filter(id => CHAT_RE.test(id) && (tokenChanged || !old.has(id)));
}

// Новые значения — из результата сохранения: перечитать запись здесь нельзя, сохранение ещё
// не завершено (транзакция), и чтение вернуло бы старые данные
function welcome(event, before) {
  const after = event.result;
  const chats = newChats(before, after);
  const token = String(after?.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || '').trim();
  if (chats.length && TOKEN_RE.test(token)) {
    sendTelegram('✅ Уведомления подключены: сюда будут приходить новые заявки и отзывы с сайта konoiko.design.', { chatIds: chats, token });
  }
}

module.exports = {
  async beforeCreate(event) {
    validate(event.params.data ?? {});
  },
  async beforeUpdate(event) {
    validate(event.params.data ?? {});
    event.state.before = await strapi.documents(UID).findFirst().catch(() => null);
  },
  afterCreate(event) {
    welcome(event, null);
  },
  afterUpdate(event) {
    welcome(event, event.state.before);
  },
};
