<template>
  <div :class="classes">
    <main class="layout-blank__main">
      <slot />
    </main>
  </div>
</template>

<script setup>
const isLoaded = ref(false)

const classes = computed(() => [
  'layout-blank',
  { 'layout-blank_loaded': isLoaded.value },
])

if (process.client) {
  onMounted(() => {
    isLoaded.value = true
  })
}
</script>

<style lang="scss" src="./style.scss" scoped />
