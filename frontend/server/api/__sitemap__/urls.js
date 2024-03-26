import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

const excludesCategories = [
  'identity',
]
const excludesSubcategories = [
  'logotipy',
]
const portfolioUrl = '/portfolio'

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const urlApi = config.public.strapi.url + '/api'
  const { data: categories } = await $fetch(`${urlApi}/category-projects?populate=subcategories`)
  const { data: projects } = await $fetch(`${urlApi}/projects?populate=categories&populate=subcategories`)
  const dynamicRoutes = []

  categories.forEach(category => {
    if (!excludesCategories.includes(category.slug)) {
      dynamicRoutes.push(`${portfolioUrl}/${category.slug}`)
    }
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        dynamicRoutes.push(`${portfolioUrl}/${category.slug}/${subcategory.slug}`)
      })
    }
  })

  projects.forEach(project => {
    if (project.subcategories?.length) {
      project.subcategories.forEach(subcategory => {
        if (!excludesSubcategories.includes(subcategory.slug)) {
          dynamicRoutes.push(`${portfolioUrl}/${subcategory.category.slug}/${subcategory.slug}/${project.slug}`)
        }
      })
    }
    else {
      project.categories.forEach(category => {
        if (!excludesCategories.includes(category.slug)) {
          dynamicRoutes.push(`${portfolioUrl}/${category.slug}/${project.slug}`)
        }
      })
    }
  })

  return dynamicRoutes
})
