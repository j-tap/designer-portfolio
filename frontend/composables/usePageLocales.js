/**
 * Языки, на которых есть текущая страница. Страница с записью Strapi (проект, категория,
 * подкатегория) сообщает их через definePageLocales: у записи может не быть перевода.
 * Остальные страницы есть на всех языках. По этим языкам переключатель не ведёт на 404,
 * а hreflang не ссылается на несуществующие версии.
 *
 * Языки хранятся вместе с адресом страницы: пока новая страница их не сообщила
 * (переход по сайту), для неё действуют все языки, а не языки предыдущей.
 */
const usePageLocalesState = () => useState('page-locales', () => null)

/**
 * entry — запись Strapi с populate=deep (в ней locale и localizations: [{ locale }]).
 * fallback — адрес без префикса языка, куда вести на язык, на котором записи нет.
 */
export function definePageLocales (entry, fallback) {
  const state = usePageLocalesState()
  const path = useRoute().path

  watchEffect(() => {
    const value = toValue(entry)
    state.value = value && {
      path,
      fallback,
      locales: [value.locale, ...(value.localizations ?? []).map(item => item.locale)],
    }
  })
}

export function usePageLocales () {
  const state = usePageLocalesState()
  const route = useRoute()
  const { localeCodes } = useI18n()

  const current = computed(() => state.value?.path === route.path ? state.value : null)

  return {
    locales: computed(() => current.value?.locales ?? localeCodes.value),
    fallback: computed(() => current.value?.fallback ?? '/'),
  }
}
