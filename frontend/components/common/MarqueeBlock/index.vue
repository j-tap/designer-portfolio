<template>
  <div :class="classes">
    <div class="marquee-block__inner">
      <slot v-for="n in props.count" :key="n" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  count: {
    type: Number,
    default: 4,
  },
  reverse: Boolean,
})
const classes = computed(() => [
  'marquee-block',
  { 'marquee-block_reverse': props.reverse },
])
</script>

<style lang="scss" scoped src="./style.scss"/>