export const defaultLocale = 'en-US'

export default {
  defaultLocale,
  debug: true,
  strategy: 'no_prefix',
  langDir: 'locales',
  globalInjection: false,
  vueI18nLoader: true,
  detectBrowserLanguage: {
    useCookie: false,
  },
  locales: [
    {
      code: 'ru-RU',
      name: 'Русский',
      dir: 'ltr',
      iso: 'ru-RU',
      file: 'ru-RU.js',
    },
    {
      code: 'en-US',
      name: 'English',
      dir: 'ltr',
      iso: 'ru-RU',
      file: 'en-US.js',
    },
  ],
  vueI18n: 'config/i18n/i18n.config.js', // path relative to nuxt.config
}