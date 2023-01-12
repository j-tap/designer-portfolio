import {useLoadingStore} from "~/stores/loadingStore";

export default defineNuxtPlugin((nuxtApp) => {
  const loadingStore = useLoadingStore()
  let isLoading = false

  nuxtApp.hook('page:start', () => {
    if (!isLoading) {
      loadingStore.updateLoading(true)
      isLoading = true
    }
  })

  nuxtApp.hook('page:transition:finish', () => {
    loadingStore.updateLoading(false)
    isLoading = false
  })
})