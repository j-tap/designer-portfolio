module.exports = ({ env }) => {
  console.log('CORS', env('CORS_ORIGIN'))
  const corsOrigin = env('CORS_ORIGIN')?.split(',') || []
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
