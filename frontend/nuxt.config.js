// https://nuxt.com/docs/api/configuration/nuxt-config
import i18n from './config/i18n/'
import strapi from './config/strapi'
import sitemap from './config/sitemap'
import { siteUrl } from './config/site'

const isDev = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	debug: isDev,
	devtools: { enabled: isDev },

	build: {
		transpile: ['vue-i18n'],
	},

	nitro: {
		preset: 'node-server',
		compressPublicAssets: !isDev,
		// Правила совпадают по адресу целиком, а у страниц всегда есть префикс языка (/ru/…),
		// поэтому для страниц работает только '/**'. Заголовки более точного правила
		// дополняют и переопределяют заголовки '/**'
		routeRules: {
			'/**': {
				headers: {
					// Страницы с данными из Strapi: браузер каждый раз проверяет, не изменились ли они
					'Cache-Control': isDev ? 'no-cache, no-store, must-revalidate' : 'public, max-age=0, must-revalidate',
					'X-Content-Type-Options': 'nosniff',
					'X-Frame-Options': 'DENY',
					'Referrer-Policy': 'strict-origin-when-cross-origin',
				},
			},
			// Корень только перенаправляет на язык посетителя: ответ зависит от Accept-Language и cookie
			'/': { headers: { 'Cache-Control': 'no-store' } },
			'/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
			'/favicon.ico': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
			'/robots.txt': { headers: { 'Cache-Control': 'public, max-age=3600' } },
			'/rss.xml': { headers: { 'Cache-Control': 'public, max-age=3600' } },
			'/sitemap_index.xml': { headers: { 'Cache-Control': 'public, max-age=3600' } },
			'/__sitemap__/**': { headers: { 'Cache-Control': 'public, max-age=3600' } },
		},
	},

	router: {
		options: {
			// Переход к якорю (#project-…) — плавной прокруткой; отступ под шапку — scroll-padding-top в app.scss
			scrollBehaviorType: 'smooth',
		},
	},

	components: {
		dirs: []
	},

	runtimeConfig: {
		strapi: {
			url: strapi.url
		},
		public: {
			siteUrl,
			strapi: {
				url: strapi.publicUrl
			},
			yandexMetrikaId: process.env.YANDEX_METRIKA_ID,
			googleAdsId: process.env.GOOGLE_ADS_ID,
			googleAdsContactLabel: process.env.GOOGLE_ADS_CONTACT_LABEL,
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
			viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
			titleTemplate: '%s',
			link: [
				// Ранний коннект к медиа-серверу: картинки проектов грузятся с него
				{ rel: 'preconnect', href: strapi.publicUrl, crossorigin: '' },
				{ rel: 'dns-prefetch', href: strapi.publicUrl },
				{ rel: 'alternate', type: 'application/rss+xml', title: 'RSS', href: '/rss.xml' },
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
				{ 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
			]
		},
		pageTransition: { name: 'page', mode: 'out-in' },
		layoutTransition: { name: 'layout', mode: 'out-in' }
	},

	site: {
		url: siteUrl
	},

	modules: [
		'@nuxtjs/i18n',
		'@nuxtjs/sitemap',
		'@nuxtjs/strapi',
	],

	strapi,
	// baseUrl — для абсолютных canonical и hreflang (useLocaleHead в app.vue)
	i18n: { ...i18n, baseUrl: siteUrl },
	sitemap,
})
