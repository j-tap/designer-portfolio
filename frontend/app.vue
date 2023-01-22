<template>
  <div class="app-container">
    <NuxtLayout>
      <TheLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { initLocale } from '~/composables/useInitLocale'
import { useMetaStore } from '~/stores/metaStore'

const metaStore = useMetaStore()
metaStore.fetchMetaInfo()

initLocale()
</script>

<style lang="scss" src="~/assets/style/app.scss" />