<template>
  <div class="layout-default">
    <TheHeader class="layout-default__header"/>
    <main class="layout-default__main">
      <slot />
    </main>
    <footer class="layout-default__footer"></footer>
  </div>
</template>

<script setup>
import TheHeader from '~/components/TheHeader/index.vue'

const route = useRoute()
const title = computed(() => route.meta.title)
</script>

<style lang="scss" scoped>
.layout-default {
  display: flex;
  min-height: 100vh;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;

  &__header {
    width: 100%;
  }
  &__main {
    margin-top: $header__height;
    padding-top: 85px;
    width: 100%;
  }
  &__footer {
    width: 100%;
  }
}
</style>