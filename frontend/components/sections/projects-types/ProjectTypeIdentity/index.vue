<template>
  <div class="project-identity">
    <pre>{{ props.data }}</pre>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
})
</script>

<style lang="scss" src="./style.scss" scoped />