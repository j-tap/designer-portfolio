<template>
  <div :class="classes">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { initLocale } from '~/composables/useInitLocale'
import { useCommonStore } from '~/stores/commonStore'
import { useMetaStore } from '~/stores/metaStore'
import { useLoadingStore } from '~/stores/loadingStore'
import { find } from '~/composables/useApi'

const nuxtApp = useNuxtApp()
const commonStore = useCommonStore()
const metaStore = useMetaStore()
const loadingStore = useLoadingStore()

initLocale()
updateMeta()

const classes = computed(() => {
  return [
    'app-container',
    { 'app-container_loading': loadingStore.isLoading },
  ]
})

async function updateMeta () {
  const { data } = await useAsyncData('meta-info', () => find('meta-info'), {
    getCachedData: key => nuxtApp.payload?.static?.[key] ?? nuxtApp.payload?.data?.[key],
  })

  metaStore.updateMetaInfo(data.value?.data)
}
</script>

<style lang="scss" src="~/assets/style/app.scss" />