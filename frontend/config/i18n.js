import ru from '../locales/ru'
export default {
  strategy: 'no_prefix',
  vueI18nLoader: true,
  defaultLocale: 'ru',
  locales: [
    {
      code: 'ru',
      name: 'Русский',
    },
  ],
  vueI18n: {
    locale: 'ru',
    fallbackLocale: 'ru',
    messages: { ru },
  },
}