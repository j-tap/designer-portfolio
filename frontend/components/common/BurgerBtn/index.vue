<template>
  <button
    :class="classes"
    @click="onClick"
  >
    <span/>
    <span/>
    <span/>
    <span/>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  }
})
const emit = defineEmits(['update:modelValue', 'click'])

const classes = computed(() => [
  'burger-btn',
  { 'burger-btn_active': props.modelValue },
])

function onClick (evt) {
  const val = !props.modelValue
  emit('update:modelValue', val)
  emit('click', val)
}
</script>

<style lang="scss" scoped src="./style.scss"/>