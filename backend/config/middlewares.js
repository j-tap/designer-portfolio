const { siteUrl } = require('../src/utils/urls');

module.exports = () => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // API вызывается только с самого сайта (админка Strapi открыта на том же домене)
      origin: siteUrl(),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  { name: 'global::populate-deep' },
];
