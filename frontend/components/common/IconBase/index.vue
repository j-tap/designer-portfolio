<template>
  <i :class="classes">
    <Component :is="iconComponent" />
  </i>
</template>

<script setup>
import IconUnknown from './icons/IconUnknown.vue'
import { kebabToPascalCase } from '~/utils/formatData'

// Иконки маленькие: попадают в бандл сразу, без отдельной загрузки каждой
const icons = import.meta.glob('./icons/Icon*.vue', { eager: true, import: 'default' })

const props = defineProps({
  name: {
    type: String,
    default: 'unknown'
  },
  size: {
    type: String,
    default: 'md',
  },
})

const iconComponent = computed(() => icons[`./icons/Icon${kebabToPascalCase(props.name)}.vue`] || IconUnknown)

const classes = computed(() => [
  'icon',
  `icon_${props.name}`,
  `icon_size-${props.size}`,
])
</script>

<style lang="scss" src="./style.scss" scoped />