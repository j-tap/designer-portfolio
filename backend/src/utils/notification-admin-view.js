'use strict';

/**
 * Подписи и подсказки к полям «Уведомлений» в админке: по ним Диана настраивает всё сама.
 * Заголовок страницы — поле name («Уведомления»), иначе Strapi показывает внутренний номер записи
 */

const UID = 'api::notification-setting.notification-setting';

const FIELDS = {
  emails: {
    label: 'Почта',
    description: 'Адреса для писем о новых заявках и отзывах, по одному на строку. Если пусто — письма идут на адрес из настроек сервера.',
    placeholder: 'diana@konoiko.design',
  },
  telegram_bot_token: {
    label: 'Telegram: ключ бота',
    description: 'В Telegram откройте @BotFather, отправьте /newbot, придумайте имя бота. BotFather пришлёт ключ вида 123456789:AA… — вставьте его сюда и сохраните.',
    placeholder: '123456789:AA…',
  },
  telegram_chat_ids: {
    label: 'Telegram: чаты',
    description: 'Напишите своему боту /start — он ответит номером чата. Вставьте номер сюда (по одному на строку) и сохраните: в чат придёт сообщение «Уведомления подключены».',
    placeholder: '123456789',
  },
};

async function configureAdminView(strapi) {
  try {
    const service = strapi.plugin('content-manager').service('content-types');
    const contentType = service.findContentType(UID);
    const config = await service.findConfiguration(contentType);

    const metadatas = { ...config.metadatas };
    for (const [field, texts] of Object.entries(FIELDS)) {
      metadatas[field] = { ...metadatas[field], edit: { ...metadatas[field]?.edit, ...texts } };
    }
    metadatas.name = { ...metadatas.name, edit: { ...metadatas.name?.edit, visible: false } };

    // По полю в строке, ключ и чаты — на всю ширину
    const edit = ['emails', 'telegram_bot_token', 'telegram_chat_ids'].map(name => [{ name, size: 12 }]);

    await service.updateConfiguration(contentType, {
      settings: { ...config.settings, mainField: 'name' },
      metadatas,
      layouts: { ...config.layouts, edit },
    });

    // Записи, созданной до появления поля name, задаём заголовок
    const settings = await strapi.documents(UID).findFirst();
    if (settings && !settings.name) {
      await strapi.db.query(UID).update({ where: { documentId: settings.documentId }, data: { name: 'Уведомления' } });
    }
  }
  catch (error) {
    strapi.log.error(`Не удалось настроить вид «Уведомлений» в админке: ${error.message}`);
  }
}

module.exports = { configureAdminView };
