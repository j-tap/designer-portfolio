import { sortByRank } from '~/config/portfolio'

// Категория с подкатегориями показывается по подкатегориям: сразу открываем первую.
// Перенаправление — до рендера страницы категории: так оно одинаково работает и при заходе
// по ссылке (ответ 302 с сервера), и при переходе по сайту
export default defineNuxtRouteMiddleware(async (to) => {
  // При гидратации решение уже принял сервер
  if (import.meta.client && useNuxtApp().isHydrating) return

  try {
    const { data } = await useStrapi().find('category-projects', {
      // Стратегия i18n — prefix: язык всегда первый сегмент адреса
      locale: to.path.split('/')[1],
      filters: { slug: { $eq: to.params.category } },
      fields: ['slug'],
      populate: { subcategories: { fields: ['slug', 'rank'] } },
    })
    const [first] = sortByRank(data[0]?.subcategories)
    if (first) return navigateTo(`${to.path}/${first.slug}`, { replace: true })
  }
  catch {
    // Strapi недоступен — страница категории сама покажет ошибку
  }
})
