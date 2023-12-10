import { createI18n } from 'vue-i18n'
import en from '~/locales/en.json'
import ru from '~/locales/ru.json'

const locales = [
  {
    code: 'ru',
    name: 'Русский',
    dir: 'ltr',
    iso: 'ru-RU',
    file: 'ru.json',
  },
  {
    code: 'en',
    name: 'English',
    dir: 'ltr',
    iso: 'ru-RU',
    file: 'en.json',
  },
]
const localeDefault = 'en'
const usersLanguage = process.client ? window.navigator.language : localeDefault
console.log(usersLanguage)
let locale = localeDefault
if (locales.map(o => o.code).includes(usersLanguage)) {
  locale = usersLanguage
}

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    locale,
    locales,
    legacy: false,
    allowComposition: true,
    vueI18nLoader: true,
    messages: {
      en,
      ru,
    },
  })

  vueApp.use(i18n)
})
