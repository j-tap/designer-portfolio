const { siteUrl } = require('../src/utils/urls');

module.exports = () => [
  'strapi::errors',
  'strapi::security',
  'strapi::poweredBy',
  {
    name: 'strapi::cors',
    config: {
      // API вызывается только с самого сайта (админка Strapi открыта на том же домене)
      origin: siteUrl(),
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
