import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { fetchAllPosts } from '~/server/utils/postsCache'

const excludesCategories = ['identity']
const excludesSubcategories = ['logotipy']
const portfolioUrl = '/portfolio'
const locales = ['en', 'ru', 'es']
const defaultLocale = 'en'

const staticPages = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: '/portfolio', priority: 0.9, changefreq: 'weekly' },
  { path: '/reviews', priority: 0.8, changefreq: 'monthly' },
  { path: '/posts', priority: 0.7, changefreq: 'daily' },
  { path: '/contacts', priority: 0.7, changefreq: 'monthly' },
]

// Стратегия i18n — prefix: локаль есть в адресе всегда, включая язык по умолчанию
function localizedPath (locale, path) {
  return `/${locale}${path}`
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const urlApi = config.public.strapi.url + '/api'
  const dynamicRoutes = []

  const addLocalizedRoute = (locale, path, options = {}) => {
    const languages = locales.reduce((acc, loc) => {
      acc[loc] = localizedPath(loc, path)
      return acc
    }, {})

    const url = asSitemapUrl({
      loc: localizedPath(locale, path),
      // lastmod только когда дата реальная: выдуманная дата обесценивает поле для роботов
      lastmod: options.lastmod || undefined,
      changefreq: options.changefreq || 'monthly',
      priority: options.priority || 0.6,
      alternates: {
        languages: {
          ...languages,
          'x-default': localizedPath(defaultLocale, path),
        },
      },
    })
    dynamicRoutes.push(url)
  }

  for (const locale of locales) {
    staticPages.forEach(page => {
      addLocalizedRoute(locale, page.path, {
        changefreq: page.changefreq,
        priority: page.priority,
      })
    })
  }

  for (const locale of locales) {
    // Ошибка одного запроса не должна обнулять всю карту сайта
    let categories = []
    let projects = []

    try {
      const response = await $fetch(`${urlApi}/category-projects`, {
        params: {
          populate: 'subcategories',
          locale: locale,
        }
      })
      categories = response?.data || []
    }
    catch (error) {
      console.error(`[SITEMAP] categories (${locale}):`, error?.message || error)
    }

    try {
      const response = await $fetch(`${urlApi}/projects`, {
        params: {
          populate: ['categories', 'subcategories', 'updatedAt'],
          locale: locale,
        }
      })
      projects = response?.data || []
    }
    catch (error) {
      console.error(`[SITEMAP] projects (${locale}):`, error?.message || error)
    }

    categories.forEach(category => {
      if (!excludesCategories.includes(category.slug)) {
        addLocalizedRoute(locale, `${portfolioUrl}/${category.slug}`, {
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: category.updatedAt,
        })
      }
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          addLocalizedRoute(locale, `${portfolioUrl}/${category.slug}/${subcategory.slug}`, {
            priority: 0.7,
            changefreq: 'weekly',
            lastmod: subcategory.updatedAt || category.updatedAt,
          })
        })
      }
    })

    projects.forEach(project => {
      const projectLastmod = project.updatedAt || project.time?.end || project.time?.start
      const projectPriority = 0.6

      if (project.subcategories?.length) {
        project.subcategories.forEach(subcategory => {
          if (!excludesSubcategories.includes(subcategory.slug)) {
            addLocalizedRoute(locale, `${portfolioUrl}/${subcategory.category.slug}/${subcategory.slug}/${project.slug}`, {
              priority: projectPriority,
              changefreq: 'monthly',
              lastmod: projectLastmod,
            })
          }
        })
      }
      else {
        project.categories.forEach(category => {
          if (!excludesCategories.includes(category.slug)) {
            addLocalizedRoute(locale, `${portfolioUrl}/${category.slug}/${project.slug}`, {
              priority: projectPriority,
              changefreq: 'monthly',
              lastmod: projectLastmod,
            })
          }
        })
      }
    })
  }

  // Страницы постов берём из того же кеша, что и /posts (внешний источник может быть недоступен)
  try {
    const cache = await fetchAllPosts()

    ;(cache?.data || []).forEach(post => {
      if (!post?.id) return

      locales.forEach(locale => {
        addLocalizedRoute(locale, `/posts/${post.id}`, {
          priority: 0.5,
          changefreq: 'monthly',
          lastmod: post.created_at,
        })
      })
    })
  }
  catch (error) {
    console.error('[SITEMAP] posts:', error?.message || error)
  }

  return dynamicRoutes
})
