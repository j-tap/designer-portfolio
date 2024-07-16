module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    data.publishedAt = null;
  },

  async afterCreate(event) {
    const { result } = event;
    const domain = process.env.DOMAIN || 'localhost';
    const site = `https://${domain}`;

    try{
      strapi.plugins['email'].services.email.send({
        to: process.env.SMTP_USERNAME,
        from: `Diana UI/UX <noreply@${process.env.SMTP_FROM}>`,
        subject: `Новый отзыв на сайте ${domain}`,
        text: '${result.text}',
        html: `
<p>Новый отзыв на сайте <a href="${site}" target="_blank">${domain}</a></p>
<blockquote cite="${site}">
  <p>${result.text}</p>
  <p>Оценка: ${result.rating}</p>
  <footer>—${result.name}, <cite>${result.company}</cite></footer>
</blockquote>
<p>
  <a href="${site}/strapi/admin/content-manager/collection-types/api::review.review/${result.id}" target="_blank">Перейти к просмотру</a>
</p>
`,
      })
      console.log('Email sent successfully');
    } catch(err) {
      console.log(err);
    }
  }
};
