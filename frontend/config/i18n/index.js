export const defaultLocale = 'en'

const locales = [
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
]

/**
 * Языки, на которых показывать запись Strapi, по убыванию предпочтения: язык страницы,
 * затем язык по умолчанию, затем остальные. Если перевода нет, показывается оригинал,
 * а не пустая страница (useStrapiData)
 */
export function contentLocales (locale) {
  return [...new Set([locale, defaultLocale, ...locales.map(({ code }) => code)])]
}

// Файлы переводов — в i18n/locales, настройки vue-i18n — в i18n/i18n.config.js
// (@nuxtjs/i18n 10 ищет их в каталоге i18n/)
export default {
  defaultLocale,
  strategy: 'prefix',
  // Язык страницы задаёт префикс адреса (/ru/…), браузер на такие адреса не влияет.
  // Адрес без префикса (/, /contacts) ведёт на язык, выбранный переключателем (cookie),
  // иначе на язык браузера, если сайт его поддерживает, иначе на английский
  detectBrowserLanguage: {
    redirectOn: 'no prefix',
    useCookie: true,
    cookieKey: 'i18n_redirected',
    fallbackLocale: defaultLocale,
  },
  locales,
}
