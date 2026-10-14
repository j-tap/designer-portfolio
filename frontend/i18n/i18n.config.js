import pluralRules from '~/config/i18n/i18n-plural'
import { defaultLocale } from '~/config/i18n'

export default defineI18nConfig(() => ({
  pluralRules,
  fallbackLocale: defaultLocale,
  legacy: false,
}))
