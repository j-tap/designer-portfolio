'use strict';

const { siteUrl, mailFrom } = require('../../../utils/urls');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Письмо админу о новом отзыве. Отправляется из контроллера, а не из lifecycle afterCreate:
 * в Strapi 5 afterCreate срабатывает и при публикации черновика из админки, и письмо
 * приходило бы второй раз. Ошибка SMTP не мешает сохранению отзыва.
 */
async function notifyNewReview(review) {
  const site = siteUrl();
  const domain = new URL(site).host;
  const adminUrl = `${strapi.config.get('server.url')}/admin/content-manager/collection-types/api::review.review/${review.documentId}`;

  // Поля отзыва пишет кто угодно: без экранирования в письмо админу можно вставить
  // свою разметку и ссылки, и оно уйдёт с нашего SMTP как доверенное
  const name = escapeHtml(review.name);
  const company = escapeHtml(review.company);
  const text = escapeHtml(review.text).replace(/\n/g, '<br>');

  try {
    await strapi.plugin('email').service('email').send({
      to: process.env.NOTIFY_EMAIL,
      from: mailFrom(),
      subject: `Новый отзыв на сайте ${domain}`,
      text: `Новый отзыв на сайте ${domain}\n\n${review.text || ''}\n\nОценка: ${review.rating}\n— ${review.name}, ${review.company}\n\nПерейти к просмотру: ${adminUrl}`,
      html: `
<p>Новый отзыв на сайте <a href="${site}" target="_blank">${escapeHtml(domain)}</a></p>
<blockquote cite="${site}">
  <p>${text}</p>
  <p>Оценка: ${Number(review.rating)}</p>
  <footer>—${name}, <cite>${company}</cite></footer>
</blockquote>
<p>
  <a href="${adminUrl}" target="_blank">Перейти к просмотру</a>
</p>
`,
    });
  }
  catch (error) {
    strapi.log.error(`Не удалось отправить письмо о новом отзыве: ${error.message}`);
  }
}

module.exports = {
  notifyNewReview,
};
