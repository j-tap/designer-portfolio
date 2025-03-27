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

onMounted(() => {
  console.log('onMounted')
  if (process.client) {
    console.log('onMounted client')
    isLoaded.value = true
  }
})
watch(isLoaded, (newValue) => {
  console.log('isLoaded changed:', newValue)
})
</script>

<style lang="scss" src="./style.scss" scoped />