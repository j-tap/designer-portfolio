// Страницы портфолио: до рендера проверяем, что запись из адреса есть в Strapi.
// Иначе неизвестный адрес отдаёт пустую страницу со статусом 200 («мягкий 404»).
//
// /portfolio/<категория>/<x> подходит и странице проекта, и странице подкатегории, и роутер
// выбирает проект. Если проекта нет, а подкатегория есть — переключаемся на маршрут подкатегории.
// Адрес при этом тот же, так что это не редирект, и страница подкатегории рендерится на сервере.
//
// Решение кладётся в useState: при гидратации браузер берёт ответ сервера, а не спрашивает Strapi снова.

const FOUND = 'found'
const SUBCATEGORY = 'subcategory'
const NOT_FOUND = 'not-found'

export default defineNuxtRouteMiddleware(async (to) => {
  const resolved = useState(`portfolio-route:${to.path}`, () => null)

  if (!resolved.value) {
    try {
      resolved.value = await resolveRoute(to)
    }
    catch (error) {
      // Strapi недоступен — пропускаем: 404 на существующую страницу хуже пустой страницы
      console.error('[portfolio middleware]', error?.message || error)
      return
    }
  }

  // Middleware стоит и на странице подкатегории: после переключения она видит то же решение
  // по тому же адресу, и там переключаться уже не нужно
  if (resolved.value === SUBCATEGORY && to.params.project) {
    return {
      name: String(to.name).replace('portfolio-category-project', 'portfolio-category-subcategory'),
      params: { category: to.params.category, subcategory: to.params.project },
    }
  }

  if (resolved.value === NOT_FOUND) {
    // При гидратации страница ошибки уже пришла с сервера — повторный showError только шумит в консоли
    if (import.meta.client && useNuxtApp().isHydrating && useError().value) return

    // fatal — чтобы при переходе внутри сайта тоже показалась страница ошибки, а не отменилась навигация
    return abortNavigation(createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true }))
  }
})

async function resolveRoute (to) {
  const { category, subcategory, project } = to.params
  // Стратегия i18n — prefix: язык всегда первый сегмент адреса
  const locale = to.path.split('/')[1]
  const { find } = useStrapi()

  const exists = async (name, filters) => {
    const { data } = await find(name, {
      locale,
      filters,
      fields: ['slug'],
      pagination: { pageSize: 1 },
    })
    return data.length > 0
  }

  if (project) {
    // Проект должен быть в этой категории (тот же фильтр, что у страницы проекта)
    // и в подкатегории из адреса, если она есть (так адрес строит карта сайта)
    const filters = {
      slug: { $eq: project },
      categories: { slug: { $eq: category } },
      ...subcategory && { subcategories: { slug: { $eq: subcategory } } },
    }
    if (await exists('projects', filters)) {
      return FOUND
    }
    if (!subcategory && await exists('subcategory-projects', { slug: { $eq: project } })) {
      return SUBCATEGORY
    }
    return NOT_FOUND
  }

  if (subcategory) {
    return await exists('subcategory-projects', { slug: { $eq: subcategory } }) ? FOUND : NOT_FOUND
  }

  return await exists('category-projects', { slug: { $eq: category } }) ? FOUND : NOT_FOUND
}
