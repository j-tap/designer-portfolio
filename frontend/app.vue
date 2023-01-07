<template>
  <div class="app-container">
    <NuxtLayout>
      <NuxtLoadingIndicator :color="loadingColors"/>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { colorBlue } from '~/assets/style/app.module.scss'
import { initLocale } from '~/composables/useInitLocale'

const route = useRoute()

const loadingColors = colorBlue

initLocale()

useHead({
  title: route.meta.title,
  meta: [
    { name: 'description', content: route.meta.description },
    { property: 'og:title', content: route.meta.title },
  ],
  bodyAttrs: {
    class: '',
  },
})
</script>

<style lang="scss" src="~/assets/style/app.scss"/>