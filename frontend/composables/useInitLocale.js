export function initLocale () {
  if (process.client) {
    const i18n = useI18n()
    const browserLocale = i18n.getBrowserLocale()

    if (browserLocale !== i18n.locale.value) {
      const codes = i18n.locales.value.map(o => o.code)

      if (codes.includes(browserLocale)) {
        i18n.setLocale(browserLocale)
      }
    }
  }
}
