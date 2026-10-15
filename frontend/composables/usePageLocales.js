/**
 * Языковые версии текущей страницы. Страница с записью Strapi (главная, проект, категория,
 * подкатегория) сообщает их через definePageLocales:
 * - locales — языки, на которые запись переведена: только они попадают в hreflang;
 * - contentLocale — язык показанной версии. Если перевода на язык страницы нет, useStrapiData
 *   отдаёт оригинал, и страница — копия оригинала: canonical ведёт на него (app.vue).
 * Остальные страницы есть на всех языках.
 *
 * Версии хранятся вместе с адресом страницы: пока новая страница их не сообщила
 * (переход по сайту), для неё действуют все языки, а не языки предыдущей.
 */
const usePageLocalesState = () => useState('page-locales', () => null)

/**
 * entry — запись Strapi из useStrapiData (в ней locale и localizations: [{ locale }]).
 */
export function definePageLocales (entry) {
  const state = usePageLocalesState()
  const path = useRoute().path

  watchEffect(() => {
    const value = toValue(entry)
    state.value = value && {
      path,
      contentLocale: value.locale,
      locales: [value.locale, ...(value.localizations ?? []).map(item => item.locale)],
    }
  })
}

export function usePageLocales () {
  const state = usePageLocalesState()
  const route = useRoute()
  const { locale, localeCodes } = useI18n()

  const current = computed(() => state.value?.path === route.path ? state.value : null)

  return {
    locales: computed(() => current.value?.locales ?? localeCodes.value),
    contentLocale: computed(() => current.value?.contentLocale ?? locale.value),
  }
}

/**
 * Атрибут lang для блока с записью Strapi: у записи без перевода он отличается от языка
 * страницы — по нему экранные чтецы и переводчик браузера определяют язык текста.
 */
export function useContentLang () {
  const { locale } = useI18n()
  return entry => (entry?.locale && entry.locale !== locale.value ? entry.locale : undefined)
}
