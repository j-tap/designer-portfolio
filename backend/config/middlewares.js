module.exports = ({ env }) => {
  const corsOrigin = env.array('CORS_ORIGIN') || []
  return [
    'strapi::errors',
    'strapi::security',
    'strapi::poweredBy',
    {
      name: 'strapi::cors',
      config: {
        headers: '*',
        origin: ['http://localhost:1337', ...corsOrigin],
      },
    },
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
}
