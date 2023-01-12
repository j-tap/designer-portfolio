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
import { setHead } from '~/composables/useMeta'

initLocale()
setHead()
</script>

<style lang="scss" src="~/assets/style/app.scss"/>