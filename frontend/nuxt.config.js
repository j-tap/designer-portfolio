// https://nuxt.com/docs/api/configuration/nuxt-config
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
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
			NODE_ENV: process.env.NODE_ENV,
		},
	},
	vite: {
		plugins: [
			VueI18nVitePlugin({
				// runtimeOnly: false,
				include: [
					resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')
				],
			}),
		],
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
		'@nuxtjs/strapi',
		'@pinia/nuxt',
		'nuxt-simple-sitemap',
  ],
  strapi,
	i18n,
	sitemap,
})