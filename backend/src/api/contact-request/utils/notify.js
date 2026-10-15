'use strict';

const { siteUrl } = require('../../../utils/urls');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Письмо админу о новом обращении. Reply-To — адрес отправителя, чтобы ответить можно было
 * прямо из почты. Ошибка SMTP не мешает сохранению (обращение останется в админке) —
 * она только логируется, поэтому функцию можно не ждать.
 */
async function notifyNewContactRequest(request) {
  const domain = new URL(siteUrl()).host;
  const adminUrl = `${strapi.config.get('admin.absoluteUrl')}/content-manager/collection-types/api::contact-request.contact-request/${request.documentId}`;

  // Поля пишет кто угодно: без экранирования в письмо можно вставить свою разметку
  const name = escapeHtml(request.name);
  const email = escapeHtml(request.email);
  const message = escapeHtml(request.message).replace(/\n/g, '<br>');

  try {
    await strapi.plugin('email').service('email').send({
      to: process.env.NOTIFY_EMAIL,
      // Адрес попадает в заголовок: переводы строк в нём недопустимы (validation в контроллере уже отсекает пробелы)
      replyTo: request.email,
      subject: `Новое сообщение с сайта ${domain}`,
      text: `Новое сообщение с сайта ${domain}\n\nОт: ${request.name} <${request.email}>\n\n${request.message}\n\nСтраница: ${request.page || '—'}\nВ админке: ${adminUrl}`,
      html: `
<p>Новое сообщение с сайта ${escapeHtml(domain)}</p>
<p><b>${name}</b> &lt;<a href="mailto:${email}">${email}</a>&gt;</p>
<blockquote><p>${message}</p></blockquote>
<p>Страница: ${escapeHtml(request.page || '—')}</p>
<p><a href="${adminUrl}" target="_blank">Открыть в админке</a></p>
`,
    });
  }
  catch (error) {
    strapi.log.error(`Не удалось отправить письмо о новом обращении: ${error.message}`);
  }
}

module.exports = { notifyNewContactRequest };
