export default defineNuxtPlugin(() => {
  addRouteMiddleware('admin', (to) => {
    if (process.client && to.fullPath === '/admin') {
      const runtimeConfig = useRuntimeConfig()
      const url = `${runtimeConfig.strapi.url}/admin`

      window.open(url, '_blank')
      return navigateTo('/')
    }
  }, { global: true })
})