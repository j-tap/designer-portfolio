// Языковые версии посадочной страницы — до рендера: шапка с переключателем языков рендерится
// раньше страницы, а slug у каждой версии свой. Саму запись и 404 загружает страница
export default defineNuxtRouteMiddleware(async (to) => {
  // При гидратации версии уже в payload
  if (import.meta.client && useNuxtApp().isHydrating) return

  // Стратегия i18n — prefix: язык всегда первый сегмент адреса
  const locale = to.path.split('/')[1]

  try {
    const { data } = await useStrapi().find('landings', {
      locale,
      filters: { slug: { $eq: to.params.landing } },
      fields: ['locale', 'slug'],
      populate: { localizations: { fields: ['locale', 'slug'] } },
    })
    const [landing] = data
    if (!landing) return

    const versions = [landing, ...(landing.localizations ?? [])].filter(version => version.slug)
    setPageLocales(to.path, {
      contentLocale: landing.locale,
      paths: Object.fromEntries(versions.map(version => [version.locale, `/${version.locale}/${version.slug}`])),
      exclusive: true,
    })
  }
  catch {
    // Strapi недоступен — страница сама покажет ошибку
  }
})
