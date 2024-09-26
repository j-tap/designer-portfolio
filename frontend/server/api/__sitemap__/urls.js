import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

const excludesCategories = ['identity']
const excludesSubcategories = ['logotipy']
const portfolioUrl = '/portfolio'
const locales = ['en', 'ru', 'es']

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const urlApi = config.public.strapi.url + '/api'
  const dynamicRoutes = []

  const addLocalizedRoute = (locale, path) => {
    dynamicRoutes.push(`/${locale}${path}`)
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
        populate: ['categories', 'subcategories'],
        locale: locale,
      }
    })

    categories.forEach(category => {
      if (!excludesCategories.includes(category.slug)) {
        addLocalizedRoute(locale, `${portfolioUrl}/${category.slug}`)
      }
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          addLocalizedRoute(locale, `${portfolioUrl}/${category.slug}/${subcategory.slug}`)
        })
      }
    })

    projects.forEach(project => {
      if (project.subcategories?.length) {
        project.subcategories.forEach(subcategory => {
          if (!excludesSubcategories.includes(subcategory.slug)) {
            addLocalizedRoute(locale, `${portfolioUrl}/${subcategory.category.slug}/${subcategory.slug}/${project.slug}`)
          }
        })
      }
      else {
        project.categories.forEach(category => {
          if (!excludesCategories.includes(category.slug)) {
            addLocalizedRoute(locale, `${portfolioUrl}/${category.slug}/${project.slug}`)
          }
        })
      }
    })
  }

  return dynamicRoutes
})
