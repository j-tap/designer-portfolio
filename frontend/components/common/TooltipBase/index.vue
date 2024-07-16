<template>
  <div class="tooltip-wrap">
    <slot />
    <i class="tooltip-wrap__info" @mouseenter="show" @mouseleave="hide">?</i>
    <p :class="['tooltip-wrap__text', { 'tooltip-wrap__text_show': display }]">{{ text }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})

const display = ref(false)

function show () {
  display.value = true
}

function hide () {
  display.value = false
}
</script>

<style lang="scss" src="./style.scss" scoped />