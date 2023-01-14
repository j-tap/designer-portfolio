module.exports = ({ env }) => [
  'strapi::errors',
  'strapi::security',
  'strapi::poweredBy',
  {
    name: 'strapi::cors',
    config: {
      headers: ['accept-language', 'Token', 'Content-Type', 'Authorization', 'Accept', 'Origin'],
      origin: env('CORS_ORIGIN')?.split(',') || [],
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
