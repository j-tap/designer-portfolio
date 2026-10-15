import { contentLocales } from '~/config/i18n'
import { sortByRank } from '~/config/portfolio'
import { pickLocaleVersions } from '~/utils/localeVersions'

// Категория с подкатегориями показывается по подкатегориям: сразу открываем первую.
// Перенаправление — до рендера страницы категории: так оно одинаково работает и при заходе
// по ссылке (ответ 302 с сервера), и при переходе по сайту
export default defineNuxtRouteMiddleware(async (to) => {
  // При гидратации решение уже принял сервер
  if (import.meta.client && useNuxtApp().isHydrating) return

  try {
    // Версии категории на всех языках: без перевода страница показывает оригинал (useStrapiData),
    // и подкатегории берутся у него
    const { data } = await useStrapi().find('category-projects', {
      locale: '*',
      filters: { slug: { $eq: to.params.category } },
      fields: ['slug', 'locale'],
      populate: { subcategories: { fields: ['slug', 'rank'] } },
    })
    // Стратегия i18n — prefix: язык всегда первый сегмент адреса
    const [category] = pickLocaleVersions(data, contentLocales(to.path.split('/')[1]))
    const [first] = sortByRank(category?.subcategories)
    if (first) return navigateTo(`${to.path}/${first.slug}`, { replace: true })
  }
  catch {
    // Strapi недоступен — страница категории сама покажет ошибку
  }
})
