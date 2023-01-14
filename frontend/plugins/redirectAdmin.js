export default defineNuxtPlugin(() => {
  addRouteMiddleware('admin', (to) => {
    if (to.fullPath === '/admin') {
      const runtimeConfig = useRuntimeConfig()
      console.log(runtimeConfig)
      const url = `${runtimeConfig.strapi.url}/admin`

      window.open(url, '_blank')
      return navigateTo('/')
    }
  }, { global: true })
})