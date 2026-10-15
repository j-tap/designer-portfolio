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
  'strapi::query',
  'strapi::body',
  { name: 'global::cleanup-uploads' },
  'strapi::session',
  'strapi::favicon',
  { name: 'global::uploads' },
  'strapi::public',
  { name: 'global::populate-deep' },
];
