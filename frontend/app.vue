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

initLocale()

const commonStore = useCommonStore()
const metaStore = useMetaStore()
metaStore.fetchMetaInfo()

const loadingStore = useLoadingStore()
const classes = computed(() => {
  return [
    'app-container',
    { 'app-container_loading': loadingStore.isLoading },
  ]
})
</script>

<style lang="scss" src="~/assets/style/app.scss" />