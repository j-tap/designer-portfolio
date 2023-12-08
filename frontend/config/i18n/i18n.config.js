import pluralRules from './i18n-plural'
import { defaultLocale } from './index'

export default defineI18nConfig((_nuxt) => ({
  lazy: false,
  legacy: false,
  fallbackLocale: defaultLocale,
  pluralRules,
}))
