import { strapiPublicUrl, strapiServerUrl } from './site'

export default {
  url: strapiServerUrl,
  publicUrl: strapiPublicUrl,
  prefix: '/api',
  version: 'v5',
  cookie: {},
  cookieName: 'strapi_jwt',
}