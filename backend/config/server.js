const { strapiPublicUrl } = require('../src/utils/urls');

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT_BACKEND', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: strapiPublicUrl(),
  // В проде Strapi стоит за Traefik (docker-compose.prod.yml): IP клиента (лимит отзывов) и HTTPS
  // (флаг Secure у cookie админки) берутся из заголовков X-Forwarded-*. Strapi 5 читает только
  // proxy.koa — булево `proxy: true`, как в Strapi 4, он молча игнорирует. Перед Strapi ровно
  // один прокси, поэтому из X-Forwarded-For берётся только последний адрес — его дописал Traefik
  proxy: {
    koa: env.bool('PROXY', false),
    maxIpsCount: 1,
  },
});
