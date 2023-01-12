export default {
  url: process.env.STRAPI_URL || 'http://localhost:1337',
  prefix: '/api',
  version: 'v4',
  cookie: {},
  cookieName: 'strapi_jwt',
}