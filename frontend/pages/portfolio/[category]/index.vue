<template>
  <h1>{{ category }}</h1>
</template>

<script setup>
const route = useRoute()
const category = computed(() => route.params.category)
</script>