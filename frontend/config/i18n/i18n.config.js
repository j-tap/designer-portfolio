import pluralRules from './i18n-plural'
import { defaultLocale } from './index'

export default defineI18nConfig((_nuxt) => ({
  pluralRules,
  fallbackLocale: defaultLocale,
  lazy: false,
  legacy: false,
}))
