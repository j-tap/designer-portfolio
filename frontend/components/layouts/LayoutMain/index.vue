<template>
  <div :class="classes">
    <TheHeader class="layout-default__header"/>
    <main class="layout-default__main">
      <slot />
    </main>
    <footer class="layout-default__footer"></footer>
    <div :class="blurClasses" />
  </div>
</template>

<script setup>
import TheHeader from '~/components/TheHeader/index.vue'
import { useCommonStore } from '~/stores/commonStore'

const commonStore = useCommonStore()

const isLoaded = ref(false)

const classes = computed(() => [
  'layout-default',
  { 'layout-default_loaded': isLoaded.value },
])

const blurClasses = computed(() => [
  'blur-backdrop',
  { 'blur-backdrop_display': commonStore.getDisplayMobileMenu },
])

if (process.client) {
  onMounted(() => {
    isLoaded.value = true
  })
}
</script>

<style lang="scss" src="./style.scss" scoped />