import { portfolioPath } from '~/config/portfolio'

const PROJECTS_SORT = [
  { time: { start: 'desc', end: 'desc' } },
  { rank: 'asc' },
]

// Превью в списке нужны только обложки: страницы, шрифты и цвета проекта не грузим
const PREVIEW_POPULATE = { preview: true, preview_hover: true }

/**
 * Проекты для списка (категория, подкатегория, «Ещё проекты»): сначала новые.
 */
export function useProjectsList (filters, { limit = 100, ...options } = {}) {
  return useStrapiData('projects', {
    filters,
    sort: PROJECTS_SORT,
    populate: PREVIEW_POPULATE,
    pagination: { pageSize: limit },
  }, options)
}

// Страницы, скрытые в админке (active: false), на сайте не показываются
function withActivePages (project) {
  return project && { ...project, pages: project.pages?.filter(page => page.active !== false) }
}

/**
 * Проект для страницы проекта. required: false — когда адрес может оказаться и не проектом
 * (/portfolio/<категория>/<подкатегория>), иначе ненайденный проект — 404.
 */
export function useProject (filters, { required = true } = {}) {
  const load = required ? useRequiredStrapiData : useStrapiData
  return load('projects', { filters }, { single: true, transform: withActivePages })
}

/**
 * Хлебные крошки портфолио: Портфолио → категория → подкатегория → проект (что есть).
 * Адреса без префикса языка — его добавляет useStructuredData.
 */
export function usePortfolioBreadcrumbs (crumbs) {
  const { t } = useI18n()

  return computed(() => {
    const { category, subcategory, project } = toValue(crumbs)
    const list = [{ name: t('menu.portfolio'), url: '/portfolio' }]

    if (category?.title) {
      list.push({ name: category.title, url: portfolioPath(category.slug) })
    }
    if (subcategory?.title) {
      list.push({ name: subcategory.title, url: portfolioPath(category?.slug, subcategory.slug) })
    }
    if (project?.title) {
      list.push({ name: project.title, url: portfolioPath(category?.slug, subcategory?.slug, project.slug) })
    }
    return list
  })
}

function shuffle (list) {
  const result = [...(list || [])]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Страница проекта: «Ещё проекты» той же категории (и подкатегории), заголовок, описание, JSON-LD.
 */
export function useProjectPage (project, { categorySlug, subcategorySlug = null }) {
  const category = computed(() => project.value.categories?.find(item => item.slug === categorySlug) ?? { slug: categorySlug })
  const subcategory = computed(() => subcategorySlug
    ? project.value.subcategories?.find(item => item.slug === subcategorySlug) ?? { slug: subcategorySlug }
    : null)

  // Порядок перемешивается один раз при загрузке и сохраняется в payload страницы:
  // иначе сервер и браузер перемешивали бы по-разному и разметка расходилась при гидратации
  const { data: moreProjects } = useProjectsList({
    slug: { $ne: project.value.slug },
    categories: { slug: { $eq: categorySlug } },
    ...(subcategorySlug && { subcategories: { slug: { $eq: subcategorySlug } } }),
  }, { limit: 15, transform: shuffle, default: () => [] })

  usePageMeta({
    title: () => [project.value.title, category.value.title].filter(Boolean).join(' / '),
    description: () => project.value.meta?.description || project.value.subtitle,
    image: () => project.value.preview_social?.url
      || project.value.preview?.formats?.medium?.url
      || project.value.pages?.[0]?.images?.[0]?.formats?.medium?.url,
    keywords: () => project.value.meta?.keywords,
  })

  definePageLocales(project)

  useStructuredData('project', {
    project,
    breadcrumbs: usePortfolioBreadcrumbs(() => ({
      category: category.value,
      subcategory: subcategory.value,
      project: project.value,
    })),
  })

  return { moreProjects }
}

/**
 * Страница списка проектов — категории или подкатегории: заголовок, описание, JSON-LD коллекции.
 */
export function usePortfolioListPage ({ title, description, category, subcategory = null, projects }) {
  usePageMeta({ title, description })
  definePageLocales(() => toValue(subcategory) || toValue(category))

  useStructuredData('collection', {
    collection: computed(() => ({
      title: toValue(title),
      description: toValue(description) || toValue(title),
      items: (toValue(projects) || []).map(project => ({
        title: project.title,
        url: portfolioPath(toValue(category).slug, toValue(subcategory)?.slug, project.slug),
      })),
    })),
    breadcrumbs: usePortfolioBreadcrumbs(() => ({
      category: toValue(category),
      subcategory: toValue(subcategory),
    })),
  })
}
