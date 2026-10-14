import pluralRules from '~/config/i18n/i18n-plural'
import { defaultLocale } from '~/config/i18n'

// Даты из Strapi — календарные (полночь UTC): форматируем в UTC, иначе у посетителя западнее UTC
// показывался бы предыдущий день, и разметка разошлась бы с серверной
const date = { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' }

export default defineI18nConfig(() => ({
  pluralRules,
  fallbackLocale: defaultLocale,
  legacy: false,
  datetimeFormats: {
    ru: { date },
    en: { date },
    es: { date },
  },
}))
