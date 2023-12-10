// https://nuxt.com/docs/api/configuration/nuxt-config
import i18n from './config/i18n/'
import strapi from './config/strapi'
import sitemap from './config/sitemap'

const baseURL = process.env.BASE_URL

export default defineNuxtConfig({
	debug: false,
	build: {
		transpile: ['vue-i18n'],
	},
	runtimeConfig: {
		strapi: {
			url: strapi.url,
		},
		public: {
			baseURL,
			yandexMetrikaId: process.env.YANDEX_METRIKA_ID,
			NODE_ENV: process.env.NODE_ENV,
		},
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/style/global.scss" as *;',
				},
			},
		},
	},
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
			meta: [
				{ name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION },
				{ name: 'yandex-verification', content: process.env.YANDEX_SITE_VERIFICATION },
				{ 'http-equiv': 'Cache-Control', content: `max-age=${process.env.CACHE_TIME || '60'}, must-revalidate` },
			],
    },
	  pageTransition: { name: 'page', mode: 'out-in' },
		layoutTransition: { name: 'layout', mode: 'out-in' },
  },
	site: {
		url: baseURL,
	},
  modules: [
		'@nuxtjs/i18n',
		'@nuxtjs/strapi',
		'@pinia/nuxt',
		'nuxt-simple-sitemap',
  ],
  strapi,
	i18n,
	sitemap,
})