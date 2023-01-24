<template>
  <div :class="classes">
    <NuxtLayout>
      <TheLoadingIndicator v-if="false" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { initLocale } from '~/composables/useInitLocale'
import { useMetaStore } from '~/stores/metaStore'
import { useLoadingStore } from '~/stores/loadingStore'

initLocale()

const metaStore = useMetaStore()
metaStore.fetchMetaInfo()

const loadingStore = useLoadingStore()
const classes = computed(() => [
  'app-container',
  { 'app-container_loading': loadingStore.isLoading },
])
</script>

<style lang="scss" src="~/assets/style/app.scss" />