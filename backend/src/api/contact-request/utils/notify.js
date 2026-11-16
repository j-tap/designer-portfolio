'use strict';

const { siteUrl } = require('../../../utils/urls');
const { notifyRecipients } = require('../../../utils/notify-recipients');
const { sendTelegram, escapeHtml: tg, clip } = require('../../../utils/telegram');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const LOCALES = { es: 'испанский', en: 'английский', ru: 'русский' };

/**
 * Адрес страницы без меток после «?»: рекламные метки длинные и нечитаемые,
 * а по самой странице и так видно, откуда пришёл человек
 */
function parsePage(page) {
  if (!page) return { path: null, url: null };

  let parsed;
  try {
    parsed = new URL(page, siteUrl());
  }
  catch {
    return { path: page, url: null };
  }

  let path = parsed.pathname;
  try {
    path = decodeURI(path);
  }
  catch {
    // Битая кодировка в адресе — показываем как есть
  }

  return { path, url: `${parsed.origin}${parsed.pathname}` };
}

// Подпись к выбранным в форме вариантам — как contact_form.topics_label во frontend/i18n/locales.
// Форма ставит их первым абзацем сообщения: «Что нужно? Редизайн платформы, UX-аудит»
const TOPIC_LABELS = ['Что нужно?', '¿Qué necesitas?', 'What do you need?'];

/**
 * Делит сообщение на выбранные в форме варианты и текст, который посетитель написал сам.
 * Пустое сообщение форма присылает как «—»
 */
function splitMessage(message) {
  let text = String(message ?? '').trim();
  let topics = null;

  const label = TOPIC_LABELS.find(item => text.startsWith(item));
  if (label) {
    const end = text.search(/\n\s*\n/);
    topics = (end === -1 ? text : text.slice(0, end)).slice(label.length).trim() || null;
    text = end === -1 ? '' : text.slice(end).trim();
  }

  return { topics, text: text === '—' ? '' : text };
}

// Текст посетителя: абзацы через пустую строку, переводы строк внутри абзаца сохраняются
function messageHtml(text) {
  return text
    .split(/\n\s*\n/)
    .map(paragraph => `<p style="margin:0 0 12px">${escapeHtml(paragraph.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

/**
 * Письмо админу о новом обращении. Reply-To — адрес отправителя, чтобы ответить можно было
 * прямо из почты. Ошибка SMTP не мешает сохранению (обращение останется в админке) —
 * она только логируется, поэтому функцию можно не ждать.
 * Разметка простая, без оформления: таблица с данными, ниже текст сообщения.
 * Подписи серые, значения и текст посетителя — обычным чёрным текстом
 */
async function notifyNewContactRequest(request) {
  const domain = new URL(siteUrl()).host;
  const adminUrl = `${strapi.config.get('admin.absoluteUrl')}/content-manager/collection-types/api::contact-request.contact-request/${request.documentId}`;
  const page = parsePage(request.page);
  const language = LOCALES[request.locale_code] || request.locale_code || null;
  // Имя — в теме письма, чтобы заявку было видно в списке писем. Переводы строк в теме недопустимы
  const subject = `Заявка с сайта ${domain}: ${String(request.name).replace(/\s+/g, ' ').slice(0, 60)}`;

  const { topics, text } = splitMessage(request.message);

  // Строки таблицы: подпись и значение (уже в HTML). Пустые не показываем
  const rows = [
    ['Имя', escapeHtml(request.name)],
    ['Почта', `<a href="mailto:${escapeHtml(request.email)}">${escapeHtml(request.email)}</a>`],
    ['Что нужно', escapeHtml(topics)],
    ['Страница', page.url ? `<a href="${escapeHtml(page.url)}" target="_blank">${escapeHtml(page.path)}</a>` : escapeHtml(page.path)],
    ['Язык страницы', escapeHtml(language)],
  ].filter(([, value]) => value);

  const gray = 'color:#888';
  const cell = 'padding:4px 16px 4px 0;vertical-align:top';
  const table = rows
    .map(([label, value]) => `<tr><td style="${cell};${gray};white-space:nowrap">${label}</td><td style="${cell}">${value}</td></tr>`)
    .join('\n');

  const messageBlock = text
    ? `<div style="border-left:3px solid #ddd;padding:2px 0 2px 14px;margin:0 0 24px">\n${messageHtml(text)}\n</div>`
    : `<p style="margin:0 0 24px;${gray}">Посетитель ничего не написал.</p>`;

  const textRows = [
    ['Имя', request.name],
    ['Почта', request.email],
    ['Что нужно', topics],
    ['Страница', page.url || page.path],
    ['Язык страницы', language],
  ].filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`);

  // Telegram — независимо от почты: чаты из админки («Уведомления»), без них ничего не уходит
  sendTelegram([
    '<b>Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${tg(request.name)}`,
    `<b>Почта:</b> ${tg(request.email)}`,
    topics && `<b>Что нужно:</b> ${tg(topics)}`,
    page.path && `<b>Страница:</b> ${tg(page.path)}`,
    language && `<b>Язык страницы:</b> ${tg(language)}`,
    '',
    text ? `<blockquote expandable>${tg(clip(text, 2500))}</blockquote>` : '<i>Посетитель ничего не написал.</i>',
    '',
    `<a href="${tg(adminUrl)}">Открыть в админке</a>`,
  ].filter(line => typeof line === 'string').join('\n'));

  // Адреса из админки («Уведомления»), без них — NOTIFY_EMAIL из .env
  const to = await notifyRecipients();
  if (!to.length) {
    strapi.log.error('Письмо о новом обращении не отправлено: не задан ни один адрес для уведомлений');
    return;
  }

  try {
    await strapi.plugin('email').service('email').send({
      to,
      // Адрес попадает в заголовок: переводы строк в нём недопустимы (validation в контроллере уже отсекает пробелы)
      replyTo: request.email,
      subject,
      text: `Новая заявка с сайта ${domain}\n\n${textRows.join('\n')}\n\nСообщение посетителя:\n\n${text || '(ничего не написал)'}\n\nОтветить: просто ответьте на это письмо\nВ админке: ${adminUrl}`,
      html: `
<div style="font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;line-height:1.5;color:#222;max-width:640px">
<h2 style="font-size:20px;margin:0 0 16px;font-weight:600">Новая заявка с сайта ${escapeHtml(domain)}</h2>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px">
${table}
</table>
<p style="margin:0 0 8px;${gray}">Сообщение посетителя</p>
${messageBlock}
<p style="margin:0;${gray}">Чтобы ответить, просто ответьте на это письмо. · <a href="${adminUrl}" target="_blank">Открыть в админке</a></p>
</div>
`,
    });
  }
  catch (error) {
    strapi.log.error(`Не удалось отправить письмо о новом обращении: ${error.message}`);
  }
}

module.exports = { notifyNewContactRequest };
