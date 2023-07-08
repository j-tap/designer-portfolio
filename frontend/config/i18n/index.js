export const defaultLocale = 'en-US'

export default {
  strategy: 'no_prefix',
  langDir: 'locales',
  vueI18nLoader: true,
  globalInjection: true,
  defaultLocale,
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
  vueI18n: './i18n.config.js',
}