export const defaultLocale = 'en'

// Файлы переводов — в i18n/locales, настройки vue-i18n — в i18n/i18n.config.js
// (@nuxtjs/i18n 10 ищет их в каталоге i18n/)
export default {
  defaultLocale,
  strategy: 'prefix',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
    alwaysRedirect: false,
    fallbackLocale: defaultLocale,
  },
  locales: [
    {
      code: 'ru',
      name: 'Русский',
      dir: 'ltr',
      language: 'ru-RU',
      file: 'ru-RU.json',
    },
    {
      code: 'en',
      name: 'English',
      dir: 'ltr',
      language: 'en-US',
      file: 'en-US.json',
    },
    {
      code: 'es',
      name: 'Español',
      dir: 'ltr',
      language: 'es-ES',
      file: 'es-ES.json',
    },
  ],
}
