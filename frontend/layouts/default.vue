<script setup>
const route = useRoute()
const title = computed(() => route.meta.title)
</script>

<template>
  <div class="layout-default">
    <header class="header">
      <h1>{{ title }}</h1>
    </header>
    <main class="main">
      <slot />
    </main>
    <footer class="footer"></footer>
  </div>
</template>

<style lang="scss" scoped></style>
