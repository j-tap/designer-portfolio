<template>
  <Component
    :is="tag"
    :class="[
      'title-outline',
      {
        // Заливка при наведении — для заголовков с текстом в data-hover
        'title-outline_hoverable': $attrs['data-hover'] != null,
        'title-outline_inverse': inverse,
      },
    ]"
  >
    <slot/>
  </Component>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    default: 'span',
  },
  inverse: Boolean,
})
</script>

<style lang="scss" scoped src="./style.scss"/>