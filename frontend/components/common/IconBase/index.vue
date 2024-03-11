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
  size: {
    type: String,
    default: 'md',
  },
})

const icon = computed(() => `${kebabToPascalCase(props.name)}`)
const iconComponent = computed(() =>
  defineAsyncComponent(async () => {
    try {
      return await import(`./icons/Icon${icon.value}.vue`);
    }
    catch (err) {
      return await import('./icons/IconUnknown.vue');
    }
  })
)

const classes = computed(() => [
  'icon',
  `icon_${props.name}`,
  `icon_size-${props.size}`,
])
</script>

<style lang="scss" src="./style.scss" scoped />