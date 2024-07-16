<template>
  <div :class="['checkbox', { 'checkbox_checked': modelValue }]">
    <input :checked="isChecked" type="checkbox" @input="onChange" />
    <span />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => props.checked || props.modelValue)

function onChange ({ target }) {
  emit('update:modelValue', target.checked)
}
</script>

<style lang="scss" src="./style.scss" scoped />