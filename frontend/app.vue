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
import { setHead } from '~/composables/useMeta'

const loadingColors = colorBlue

initLocale()
setHead()
</script>

<style lang="scss" src="~/assets/style/app.scss"/>