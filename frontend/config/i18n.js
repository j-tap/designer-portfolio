import ru from '../locales/ru'
import en from '../locales/en'

const defaultLocale = 'en'

export default {
  strategy: 'no_prefix',
  vueI18nLoader: true,
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
  },
}