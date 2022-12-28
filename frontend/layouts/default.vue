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
    width: 100%;

    @include screen('sm') {
      margin-top: $header__height_sm;
      padding-top: 20px;
    }
    @include screen('md') {
      margin-top: $header__height_md;
      padding-top: 20px;
    }
    @include screen('lg') {
      margin-top: $header__height_lg;
      padding-top: 76px;
    }
  }
  &__footer {
    width: 100%;
  }
}
</style>