<template>
  <div :class="classes" :style="`width:${progress}%`" />
</template>

<script setup>
import { useLoadingStore } from '~/stores/loadingStore'

const loadingStore = useLoadingStore()

const classes = computed(() => [
  'loading-indicator',
  { 'loading-indicator_active': loadingStore.getIsLoading }
])
const progress = computed(() => 100 / loadingStore.countLoading)
</script>

<style lang="scss" src="./style.scss" scoped />