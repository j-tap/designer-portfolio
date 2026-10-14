<template>
  <div class="back-link">
    <NuxtLink
      :to="localePath(to)"
    >
      <IconBase name="arrow-left" />
      <slot />
    </NuxtLink>
  </div>
</template>

<script setup>
import { IconBase } from '~/components/common'

const localePath = useLocalePath()

// Адрес без префикса языка: строка или объект маршрута ({ path, hash })
defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
})
</script>

<style lang="scss" src="./style.scss" scoped />
