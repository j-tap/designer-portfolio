const { strapiPublicUrl } = require('../src/utils/urls');

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT_BACKEND', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: strapiPublicUrl(),
  // В проде Strapi стоит за Traefik (docker-compose.prod.yml), и IP клиента берётся из X-Forwarded-For
  proxy: env.bool('PROXY', false)
});
