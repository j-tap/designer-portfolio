<template>
  <button
    :class="['burger-btn', { 'burger-btn_active': open }]"
    type="button"
    :aria-label="t('menu.toggle')"
    :aria-expanded="open"
    @click="open = !open"
  >
    <span/>
    <span/>
    <span/>
    <span/>
  </button>
</template>

<script setup>
const { t } = useI18n()
const open = defineModel({ type: Boolean, required: true })
</script>

<style lang="scss" scoped src="./style.scss"/>