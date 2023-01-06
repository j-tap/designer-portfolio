<template>
  <Component :is="props.tag" ref="elem" :class="classes">
    <slot/>
  </Component>
</template>

<script setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'span',
  },
  inverse: Boolean,
})
const elem = ref(null);
const hoverable = computed(() => elem?.value?.hasAttribute('data-hover'))
const classes = computed(() => [
  'title-outline',
  {
    'title-outline_hoverable': hoverable.value,
    'title-outline_inverse': props.inverse,
  },
])
</script>

<style lang="scss" scoped src="./style.scss"/>