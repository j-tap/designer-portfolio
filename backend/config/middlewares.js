module.exports = ({ env }) => [
  'strapi::errors',
  'strapi::security',
  'strapi::poweredBy',
  {
    name: 'strapi::cors',
    config: {
      // Список доменов сайта через запятую, например https://example.com.
      // Без переменной (или с пустой) CORS открыт для всех, как было раньше
      origin: env('CORS_ORIGINS') || '*',
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {name: 'global::redirector'},
  { name: 'global::logRequest' },
];
