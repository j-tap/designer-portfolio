<template>
  <i :class="classes">
    <Component :is="iconComponent" />
  </i>
</template>

<script setup>
import { kebabToPascalCase } from '~/utils/formatData'

const props = defineProps({
  name: {
    type: String,
    default: 'unknown'
  },
})

const icon = computed(() => `Icon${kebabToPascalCase(props.name)}`)
const iconComponent = computed(() =>
    defineAsyncComponent(() => import(`./icons/${icon.value}.vue`)))

const classes = computed(() => [
  'icon',
  `icon_${name}`
])
</script>

<style lang="scss" src="./style.scss" scoped />