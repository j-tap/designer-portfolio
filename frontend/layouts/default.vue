<template>
  <div :class="classes">
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
const isLoaded = ref(false)
const title = computed(() => route.meta.title)
const classes = computed(() => [
  'layout-default',
  { 'layout-default_loaded': isLoaded.value },
])

onMounted(() => {
  isLoaded.value = true
})
</script>

<style lang="scss" scoped>
.layout-default {
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;

  &::after {
    content: ' ';
    position: absolute;
    z-index: 90;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
    backdrop-filter: blur(40px);
    transition: opacity .3s ease-in, visibility .3s ease-in;
  }

  &_loaded {
    &::after {
      opacity: 0;
      visibility: hidden;
    }
  }

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