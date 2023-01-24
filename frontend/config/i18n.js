import ru from '../locales/ru'
import en from '../locales/en'
import pluralRules from './i18n-plural'

const defaultLocale = 'en'

export default {
  strategy: 'no_prefix',
  vueI18nLoader: true,
  legacy: false,
  globalInjection: true,
  defaultLocale,
  locales: [
    {
      code: 'ru',
      name: 'Русский',
    },
    {
      code: 'en',
      name: 'English',
    },
  ],
  vueI18n: {
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    messages: { ru, en },
    pluralRules,
  },
}