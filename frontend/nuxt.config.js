// https://nuxt.com/docs/api/configuration/nuxt-config
import i18n from './config/i18n'
import strapi from './config/strapi'
export default defineNuxtConfig({
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "./assets/style/variables.scss" as *; @use "./assets/style/mixins.scss" as *;',
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
  strapi,
	i18n,
})