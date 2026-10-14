<template>
  <div :class="['checkbox', { 'checkbox_checked': isChecked }]">
    <input v-model="model" :value="value" type="checkbox" />
    <span />
  </div>
</template>

<script setup>
// v-model — либо true/false, либо массив выбранных значений (как у нативного checkbox)
const model = defineModel({ type: [Boolean, Array], default: false })

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: true,
  },
})

const isChecked = computed(() => (Array.isArray(model.value) ? model.value.includes(props.value) : model.value))
</script>

<style lang="scss" src="./style.scss" scoped />
