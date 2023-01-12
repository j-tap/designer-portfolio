export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    console.log('Nuxt Plugin errorHandler', error, context)
  }
})
