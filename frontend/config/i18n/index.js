export const defaultLocale = 'en-US'

export default {
  defaultLocale,
  debug: false,
  strategy: 'prefix',
  langDir: 'locales',
  globalInjection: false,
  vueI18nLoader: true,
  detectBrowserLanguage: {
    useCookie: false,
  },
  locales: [
    {
      code: 'ru',
      name: 'Русский',
      dir: 'ltr',
      iso: 'ru-RU',
      file: 'ru-RU.json',
    },
    {
      code: 'en',
      name: 'English',
      dir: 'ltr',
      iso: 'ru-RU',
      file: 'en-US.json',
    },
    {
      code: 'es',
      name: 'Español',
      dir: 'ltr',
      iso: 'es-ES',
      file: 'es-ES.json',
    },
  ],
  vueI18n: 'config/i18n/i18n.config.js', // path relative to nuxt.config
}