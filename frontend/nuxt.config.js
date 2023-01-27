// https://nuxt.com/docs/api/configuration/nuxt-config
import i18n from './config/i18n'
import strapi from './config/strapi'

export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			baseURL: process.env.BASE_URL || 'http://localhost:3000',
		},
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/style/global.scss" as *;',
				},
			}
		},
	},
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
			meta: [
				{ name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION },
				{ 'http-equiv': 'expires', content: process.env.CACHE_TIME || '60' },
			],
    },
	  pageTransition: { name: 'page', mode: 'out-in' },
		layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  modules: [
		'@nuxtjs/strapi',
	  '@nuxtjs/i18n',
		'@pinia/nuxt',
  ],
  strapi,
	i18n,
})