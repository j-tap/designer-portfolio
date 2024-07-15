module.exports = ({ env }) => [
  'strapi::errors',
  'strapi::security',
  'strapi::poweredBy',
  'strapi::cors',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {name: 'global::redirector'},
  { name: 'global::logRequest' },
];
