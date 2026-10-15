import { contentLocales } from '~/config/i18n'

// Языковые версии посадочной страницы — до рендера: шапка с переключателем языков рендерится
// раньше страницы, а slug у каждой версии свой. Саму запись и 404 загружает страница.
// Без перевода на язык адреса страница показывает оригинал (как проекты), а адрес с чужим slug
// при переведённой версии ведёт на её адрес
export default defineNuxtRouteMiddleware(async (to) => {
  // При гидратации версии уже в payload
  if (import.meta.client && useNuxtApp().isHydrating) return

  // Стратегия i18n — prefix: язык всегда первый сегмент адреса
  const locale = to.path.split('/')[1]

  try {
    // Версии с этим slug на всех языках: slug у версий может совпадать
    const { data } = await useStrapi().find('landings', {
      locale: '*',
      filters: { slug: { $eq: to.params.landing } },
      fields: ['locale', 'slug'],
      populate: { localizations: { fields: ['locale', 'slug'] } },
    })
    const chain = contentLocales(locale)
    const [landing] = [...data].sort((a, b) => chain.indexOf(a.locale) - chain.indexOf(b.locale))
    if (!landing) return

    const versions = [landing, ...(landing.localizations ?? [])].filter(version => version.slug)
    const paths = Object.fromEntries(versions.map(version => [version.locale, `/${version.locale}/${version.slug}`]))

    if (paths[locale] && paths[locale] !== to.path) {
      return navigateTo({ path: paths[locale], query: to.query, hash: to.hash }, { redirectCode: 301 })
    }

    setPageLocales(to.path, { contentLocale: landing.locale, paths })
  }
  catch {
    // Strapi недоступен — страница сама покажет ошибку
  }
})
