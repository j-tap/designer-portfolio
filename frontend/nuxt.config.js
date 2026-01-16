// https://nuxt.com/docs/api/configuration/nuxt-config
import i18n from './config/i18n/'
import strapi from './config/strapi'
import sitemap from './config/sitemap'

const baseURL = process.env.BASE_URL
const isDev = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
	compatibilityDate: '2026-01-16',
	mode: isDev ? 'development' : 'production',
	debug: isDev,
	devtools: { enabled: isDev },

	build: {
		transpile: ['vue-i18n'],
	},

	nitro: {
    preset: 'node-server',
    compressPublicAssets: !isDev,
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
			'/**': { 
				streaming: false,
				headers: {
					'X-Content-Type-Options': 'nosniff',
					'X-Frame-Options': 'DENY',
					'X-XSS-Protection': '1; mode=block',
					'Referrer-Policy': 'strict-origin-when-cross-origin',
				}
			}
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
		port: process.env.PORT
	},

	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
			titleTemplate: '%s',
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
				{ rel: 'manifest', href: '/site.webmanifest' },
			],
			meta: [
				{ name: 'format-detection', content: 'telephone=no' },
				{ name: 'theme-color', content: '#000000' },
				{ name: 'msapplication-TileColor', content: '#000000' },
				{ name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION },
				{ name: 'yandex-verification', content: process.env.YANDEX_SITE_VERIFICATION },
				{ 'http-equiv': 'Cache-Control', content: `max-age=${process.env.CACHE_TIME || '60'}, must-revalidate` },
				{ 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
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