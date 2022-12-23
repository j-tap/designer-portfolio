// https://nuxt.com/docs/api/configuration/nuxt-config
import en from './locales/en'
import ru from './locales/ru'
export default defineNuxtConfig({
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "./assets/style/variables.scss" as *;',
				},
			}
		},
	},
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=320, initial-scale=1',
      title: 'App',
    },
	  pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
		'@nuxtjs/strapi',
	  '@nuxtjs/i18n',
  ],
  strapi: {
    url: process.env.STRAPI_URL,
    prefix: '/api',
    version: 'v4',
    cookie: {},
    cookieName: 'strapi_jwt',
  },
	i18n: {
		locales: ['en', 'ru'],
		defaultLocale: 'en',
		vueI18n: {
			messages: { en, ru },
		},
	},
})