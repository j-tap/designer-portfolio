// https://nuxt.com/docs/api/configuration/nuxt-config
import i18n from './config/i18n/'
import strapi from './config/strapi'
import sitemap from './config/sitemap'

const baseURL = process.env.BASE_URL
const isDev = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
	// debug: isDev,
	devtools: { enabled: isDev },

	build: {
		transpile: ['vue-i18n'],
	},

	nitro: {
    preset: 'node-server',
    compressPublicAssets: false,
    publicAssets: [
      {
        baseURL: '/_nuxt/',
        dir: '.output/public/_nuxt',
        maxAge: 60 * 60 * 24 * 365
      }
    ],
		prerender: {
			// crawlLinks: true,
			// routes: ['/', 'sitemap.xml'],
			ignore: ['/card']
		},
		routeRules: {
			'/**': { streaming: false }
		}
	},

	components: {
		dirs: []
	},

	runtimeConfig: {
		strapi: {
			url: strapi.url
		},
		public: {
			baseURL,
			strapi: {
				url: strapi.publicUrl
			},
			yandexMetrikaId: process.env.YANDEX_METRIKA_ID,
			NODE_ENV: process.env.NODE_ENV
		}
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/style/global.scss" as *;'
				}
			}
		}
	},

	devServer: {
		port: process.env.PORT_FRONTEND
	},

	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0',
			meta: [
				{ name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION },
				{ name: 'yandex-verification', content: process.env.YANDEX_SITE_VERIFICATION },
				{ 'http-equiv': 'Cache-Control', content: `max-age=${process.env.CACHE_TIME || '60'}, must-revalidate` }
			]
		},
		pageTransition: { name: 'page', mode: 'out-in' },
		layoutTransition: { name: 'layout', mode: 'out-in' }
	},

	site: {
		url: baseURL
	},

	modules: [
		'@nuxt/devtools',
		'@nuxtjs/i18n',
		'@nuxtjs/sitemap',
		'@nuxtjs/strapi',
		'@pinia/nuxt',
	],

	strapi,
	i18n,
	sitemap,
	compatibilityDate: '2024-07-17'
})