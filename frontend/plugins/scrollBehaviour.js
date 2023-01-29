import { useLoadingStore } from '~/stores/loadingStore'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = async (to, from, savedPosition) => {
    const loadingStore = useLoadingStore()
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
      let timeout = null

      watch(loadingStore, ({ countLoading }) => {
        if (timeout) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
          if (countLoading === 0) {
            resolve(goTo)
          }
        }, 500)
      })
    })
  }
})