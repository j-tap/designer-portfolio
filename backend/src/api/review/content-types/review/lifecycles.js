function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    data.publishedAt = null;
  },

  async afterCreate(event) {
    const { result } = event;
    const domain = process.env.DOMAIN || 'localhost';
    const site = `https://${domain}`;
    const adminUrl = `${site}/strapi/admin/content-manager/collection-types/api::review.review/${result.id}`;

    // Поля отзыва пишет кто угодно: без экранирования в письмо админу можно вставить
    // свою разметку и ссылки, и оно уйдёт с нашего SMTP как доверенное
    const name = escapeHtml(result.name);
    const company = escapeHtml(result.company);
    const text = escapeHtml(result.text).replace(/\n/g, '<br>');

    // Без await ошибка SMTP становится необработанным отклонением промиса и роняет процесс
    try {
      await strapi.plugins['email'].services.email.send({
        to: process.env.ADMIN_EMAIL,
        from: `Diana UI/UX <noreply@${process.env.SMTP_FROM}>`,
        subject: `Новый отзыв на сайте ${domain}`,
        text: `Новый отзыв на сайте ${domain}\n\n${result.text || ''}\n\nОценка: ${result.rating}\n— ${result.name}, ${result.company}\n\nПерейти к просмотру: ${adminUrl}`,
        html: `
<p>Новый отзыв на сайте <a href="${site}" target="_blank">${escapeHtml(domain)}</a></p>
<blockquote cite="${site}">
  <p>${text}</p>
  <p>Оценка: ${Number(result.rating)}</p>
  <footer>—${name}, <cite>${company}</cite></footer>
</blockquote>
<p>
  <a href="${adminUrl}" target="_blank">Перейти к просмотру</a>
</p>
`,
      });
      console.log('Email sent successfully');
    } catch(err) {
      console.log(err);
    }
  }
};
