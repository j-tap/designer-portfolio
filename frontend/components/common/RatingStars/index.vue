<template>
  <div :class="['rating-stars', { 'rating-stars_changeable': editable }]">
    <label
      v-for="i in max"
      :key="i"
      :class="['rating-stars__item', { 'rating-stars__item_active': modelValue >= i }]"
    >
      <input :value="i" type="radio" :checked="modelValue === i" @input="onChange" />
      <span>
        <span v-if="editable">{{ i }}</span>
      </span>
    </label>
  </div>
</template>

<script setup>
const max = 5
const props = defineProps({
  modelValue: {
    type: Number,
    default: max,
  },
  max: {
    type: Number,
    default: max,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

function onChange ({ target }) {
  if (props.editable) {
    emit('update:modelValue', parseInt(target.value, 10))
  }
}
</script>

<style lang="scss" src="./style.scss" scoped />