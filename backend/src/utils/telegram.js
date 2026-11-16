'use strict';

/**
 * Уведомления в Telegram. Ключ бота и чаты задаются в админке («Уведомления»), поэтому
 * Диана подключает их сама: создаёт бота у @BotFather, пишет ему /start, бот отвечает номером
 * чата, номер вставляется в админку. Ключ можно задать и в .env (TELEGRAM_BOT_TOKEN).
 *
 * Бот получает сообщения опросом (getUpdates), без вебхука: не нужен открытый адрес на сервере.
 * Опрос идёт только в проде — локальный запуск не перехватывает сообщения у рабочего бота.
 */

const UID = 'api::notification-setting.notification-setting';
const API = 'https://api.telegram.org';
const TOKEN_RE = /^\d{5,}:[A-Za-z0-9_-]{30,}$/;
const CHAT_RE = /^-?\d{5,}$/;
// Предел Telegram — 4096 символов на сообщение, с запасом под разметку
const MAX_LENGTH = 3800;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function splitList(value) {
  return String(value ?? '').split(/[\s,;]+/).map(item => item.trim()).filter(Boolean);
}

async function telegramSettings() {
  const settings = await strapi.documents(UID).findFirst().catch(() => null);
  const token = String(settings?.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatIds = [...new Set(splitList(settings?.telegram_chat_ids).filter(id => CHAT_RE.test(id)))];
  return { token: TOKEN_RE.test(token) ? token : null, chatIds };
}

async function callTelegram(token, method, body, timeoutMs = 15000) {
  const response = await fetch(`${API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const data = await response.json().catch(() => ({}));
  // В текст ошибки не попадает ключ: только код и описание от Telegram
  if (!data.ok) throw new Error(`${method}: ${data.error_code || response.status} ${data.description || ''}`.trim());
  return data.result;
}

/**
 * Отправляет сообщение (HTML-разметка Telegram) во все чаты из настроек.
 * Ошибки только логируются, поэтому функцию можно не ждать
 */
async function sendTelegram(html, { chatIds: only, token: tokenOverride } = {}) {
  const settings = await telegramSettings();
  const token = tokenOverride ?? settings.token;
  const targets = only ?? settings.chatIds;
  if (!token || !targets.length) return;

  await Promise.all(targets.map(chatId => callTelegram(token, 'sendMessage', {
    chat_id: chatId,
    text: html.length > MAX_LENGTH ? `${html.slice(0, MAX_LENGTH)}…` : html,
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
  }).catch((error) => {
    strapi.log.error(`Не удалось отправить уведомление в Telegram (чат ${chatId}): ${error.message}`);
  })));
}

// Обрезка текста посетителя по границе, чтобы не разрезать HTML-сущность
function clip(text, max) {
  const value = String(text ?? '').trim();
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function startHint(chatId) {
  return [
    `Номер этого чата: <code>${chatId}</code>`,
    '',
    'Вставьте его в админке сайта: «Уведомления» → поле «Telegram: чаты» (по одному на строку) и сохраните.',
    'После этого сюда будут приходить заявки и отзывы с сайта.',
  ].join('\n');
}

/**
 * Опрос бота: на любое сообщение отвечает номером чата. Ключ читается из админки на каждом
 * круге, так что новый ключ подхватывается без перезапуска
 */
function startTelegramPolling() {
  if (process.env.NODE_ENV !== 'production' || process.env.TELEGRAM_POLLING === 'false') return;

  let offset = 0;
  let currentToken = null;
  let stopped = false;

  (async () => {
    while (!stopped) {
      const { token } = await telegramSettings();
      if (!token) {
        await sleep(60 * 1000);
        continue;
      }
      if (token !== currentToken) {
        currentToken = token;
        offset = 0;
      }
      try {
        const updates = await callTelegram(token, 'getUpdates', {
          offset, timeout: 50, allowed_updates: ['message'],
        }, 60 * 1000);
        for (const update of updates) {
          offset = update.update_id + 1;
          const chatId = update.message?.chat?.id;
          if (chatId) {
            await callTelegram(token, 'sendMessage', { chat_id: chatId, text: startHint(chatId), parse_mode: 'HTML' })
              .catch(error => strapi.log.error(`Telegram: не удалось ответить в чат ${chatId}: ${error.message}`));
          }
        }
      }
      catch (error) {
        strapi.log.error(`Telegram: ${error.message}`);
        // Неверный ключ или сеть: не долбим API, пробуем позже
        await sleep(60 * 1000);
      }
    }
  })();

  strapi.server?.httpServer?.on('close', () => { stopped = true; });
}

module.exports = {
  sendTelegram, startTelegramPolling, telegramSettings, escapeHtml, clip, TOKEN_RE, CHAT_RE, splitList,
};
