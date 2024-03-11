import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

const excludes = [
  'identity',
]

export default defineSitemapEventHandler(async () => {
  const portfolioUrl = '/portfolio'
  const apiUrl = process.env.STRAPI_URL + '/api'
  const { data: categories } = await $fetch(`${apiUrl}/category-projects`)
  const { data: projects } = await $fetch(`${apiUrl}/projects?populate=categories`)
  const dynamicRoutes = []

  categories.forEach(category => {
    dynamicRoutes.push(`${portfolioUrl}/${category.slug}`)
  })

  projects.forEach(project => {
    project.categories.forEach(category => {
      if (!excludes.includes(category.slug)) {
        dynamicRoutes.push(`${portfolioUrl}/${category.slug}/${project.slug}`)
      }
    })
  })

  return dynamicRoutes

  // // fetch data directly in the correct type
  // const posts = await $fetch<ReturnType<typeof asSitemapUrl>>('/api/posts')
  // const pages = await $fetch<{ pages: { slug: string, title: string } }>('/api/posts')
  // return [
  //   ...posts,
  //   // map URLS as needed
  //   ...pages.map(p => asSitemapUrl({
  //     loc: p.slug,
  //   }))
  // ]
})
