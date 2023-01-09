export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = async (to, from, savedPosition) => {
    // console.log('scrollBehavior', to, from, savedPosition)
    // nuxtApp.hook('page:finish', () => {
    //   console.log('page:finish')
    // })
    let goTo = {
      top: 0,
      behavior: 'auto',
    }

    if (to.hash) {
      goTo = {
        el: to.hash,
        behavior: 'smooth',
        top: 93,
      }
    } else if (savedPosition) {
      goTo = savedPosition
    }

    return new Promise((resolve) => {
      // TODO: Заменить на завершение всех загрузок
      setTimeout(() => {
        resolve(goTo)
      }, 500)
    })
  }
})