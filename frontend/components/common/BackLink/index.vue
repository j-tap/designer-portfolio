<template>
  <div class="back-link">
    <NuxtLink
      :to="to"
    >
      <IconBase name="arrow-left" />
      <slot />
    </NuxtLink>
  </div>
</template>

<script setup>
import { IconBase } from '~/components/common'

const props = defineProps({
  to: Object,
})
</script>

<style lang="scss" src="./style.scss" scoped />
