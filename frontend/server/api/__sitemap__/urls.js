import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

const excludesCategories = ['identity']
const excludesSubcategories = ['logotipy']
const portfolioUrl = '/portfolio'
const locales = ['en', 'ru', 'es']

const staticPages = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: '/portfolio', priority: 0.9, changefreq: 'weekly' },
  { path: '/reviews', priority: 0.8, changefreq: 'monthly' },
  { path: '/contacts', priority: 0.7, changefreq: 'monthly' },
]

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const urlApi = config.public.strapi.url + '/api'
  const baseUrl = config.public.baseURL
  const dynamicRoutes = []
  const now = new Date().toISOString()

  const addLocalizedRoute = (locale, path, options = {}) => {
    const fullPath = locale === 'en' ? path : `/${locale}${path}`
    const url = asSitemapUrl({
      loc: fullPath,
      lastmod: options.lastmod || now,
      changefreq: options.changefreq || 'monthly',
      priority: options.priority || 0.6,
      alternates: {
        languages: locales.reduce((acc, loc) => {
          const locPath = loc === 'en' ? path : `/${loc}${path}`
          acc[loc] = locPath
          return acc
        }, {}),
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
    const { data: categories } = await $fetch(`${urlApi}/category-projects`, {
      params: {
        populate: 'subcategories',
        locale: locale,
      }
    })

    const { data: projects } = await $fetch(`${urlApi}/projects`, {
      params: {
        populate: ['categories', 'subcategories', 'updatedAt'],
        locale: locale,
      }
    })

    categories.forEach(category => {
      if (!excludesCategories.includes(category.slug)) {
        addLocalizedRoute(locale, `${portfolioUrl}/${category.slug}`, {
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: category.updatedAt || now,
        })
      }
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          addLocalizedRoute(locale, `${portfolioUrl}/${category.slug}/${subcategory.slug}`, {
            priority: 0.7,
            changefreq: 'weekly',
            lastmod: subcategory.updatedAt || category.updatedAt || now,
          })
        })
      }
    })

    projects.forEach(project => {
      const projectLastmod = project.updatedAt || project.time?.end || project.time?.start || now
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

  return dynamicRoutes
})
