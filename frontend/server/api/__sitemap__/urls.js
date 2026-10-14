import qs from 'qs'
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { fetchAllPosts } from '~/server/utils/postsCache'
import i18nConfig from '~/config/i18n'
import { hasProjectPages, listOnly, portfolioPath } from '~/config/portfolio'

const locales = i18nConfig.locales.map(locale => locale.code)

const staticPages = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: '/portfolio', priority: 0.9, changefreq: 'weekly' },
  { path: '/reviews', priority: 0.8, changefreq: 'monthly' },
  { path: '/posts', priority: 0.7, changefreq: 'daily' },
  { path: '/contacts', priority: 0.7, changefreq: 'monthly' },
]

// Больше 100 записей за запрос Strapi не отдаёт (config/api.js в бэкенде)
const PAGE_SIZE = 100

/**
 * Адреса страниц для карты сайта. Ссылки на другие языковые версии (hreflang) модуль
 * @nuxtjs/sitemap добавляет сам: он сопоставляет одинаковые пути разных языков.
 */
export default defineSitemapEventHandler(async () => {
  // С сервера — во внутренний адрес Strapi (в Docker — сервис strapi), а не через внешний домен
  const urlApi = `${useRuntimeConfig().strapi.url}/api`
  const routes = []

  // Стратегия i18n — prefix: язык есть в адресе всегда, включая язык по умолчанию
  const add = (locale, path, { lastmod, changefreq = 'monthly', priority = 0.6 } = {}) => {
    // lastmod только когда дата реальная: выдуманная дата обесценивает поле для роботов
    routes.push(asSitemapUrl({ loc: `/${locale}${path}`, lastmod: lastmod || undefined, changefreq, priority }))
  }

  async function findAll (name, params) {
    const items = []
    for (let page = 1; ; page++) {
      const query = qs.stringify({ ...params, pagination: { page, pageSize: PAGE_SIZE } }, { encodeValuesOnly: true })
      const { data, meta } = await $fetch(`${urlApi}/${name}?${query}`)
      items.push(...data)
      if (page >= (meta?.pagination?.pageCount || 1)) return items
    }
  }

  // Ошибка одного запроса не должна обнулять всю карту сайта
  async function safeFindAll (name, params, locale) {
    try {
      return await findAll(name, params)
    }
    catch (error) {
      console.error(`[SITEMAP] ${name} (${locale}):`, error?.message || error)
      return []
    }
  }

  for (const locale of locales) {
    staticPages.forEach(({ path, ...options }) => add(locale, path, options))

    const categories = await safeFindAll('category-projects', { populate: ['subcategories'], locale }, locale)
    // Адрес проекта в подкатегории строится через её категорию: subcategory.category.slug
    const projects = await safeFindAll('projects', {
      populate: { categories: true, subcategories: { populate: ['category'] } },
      locale,
    }, locale)

    categories.forEach((category) => {
      if (!listOnly.categories.includes(category.slug)) {
        add(locale, portfolioPath(category.slug), { priority: 0.8, changefreq: 'weekly', lastmod: category.updatedAt })
      }
      category.subcategories?.forEach((subcategory) => {
        add(locale, portfolioPath(category.slug, subcategory.slug), {
          priority: 0.7,
          changefreq: 'weekly',
          lastmod: subcategory.updatedAt || category.updatedAt,
        })
      })
    })

    projects.forEach((project) => {
      const lastmod = project.updatedAt || project.time?.end || project.time?.start
      // Проект в подкатегориях — по адресам подкатегорий, иначе — по адресам категорий
      const places = project.subcategories?.length
        ? project.subcategories.map(subcategory => ({ category: subcategory.category?.slug, subcategory: subcategory.slug }))
        : project.categories.map(category => ({ category: category.slug }))

      places
        .filter(place => place.category && hasProjectPages(place))
        .forEach(place => add(locale, portfolioPath(place.category, place.subcategory, project.slug), { lastmod }))
    })
  }

  // Страницы постов берём из того же кеша, что и /posts (внешний источник может быть недоступен)
  try {
    const { data = [] } = await fetchAllPosts()

    data.filter(post => post?.id).forEach((post) => {
      locales.forEach(locale => add(locale, `/posts/${post.id}`, {
        priority: 0.5,
        changefreq: 'monthly',
        lastmod: post.created_at,
      }))
    })
  }
  catch (error) {
    console.error('[SITEMAP] posts:', error?.message || error)
  }

  return routes
})
