export default {
  urls: async () => {
    const portfolioUrl = '/portfolio'
    const apiUrl = process.env.STRAPI_URL + '/api'
    const categoriesResp = await fetch(`${apiUrl}/category-projects`)
    const { data: categories }  = await categoriesResp.json()
    const projectsResp = await fetch(`${apiUrl}/projects?populate=categories`)
    const { data: projects } = await projectsResp.json()
    const dynamicRoutes = []

    categories.forEach(category => {
      dynamicRoutes.push(`${portfolioUrl}/${category.slug}`)
    })

    projects.forEach(project => {
      project.categories.forEach(category => {
        dynamicRoutes.push(`${portfolioUrl}/${category.slug}/${project.slug}`)
      })
    })

    return dynamicRoutes
  },
}
