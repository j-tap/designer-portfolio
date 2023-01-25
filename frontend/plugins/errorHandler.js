export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.config.errorHandler = (error, context) => {
    console.warn('Custom handler errors:', error, context)
    // if (error.statusCode === 404) {}
  }
})
