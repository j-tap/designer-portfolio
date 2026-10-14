import { strapiPublicUrl, strapiServerUrl } from './site'

export default {
  url: strapiServerUrl,
  publicUrl: strapiPublicUrl,
  prefix: '/api',
  version: 'v4',
  cookie: {},
  cookieName: 'strapi_jwt',
}