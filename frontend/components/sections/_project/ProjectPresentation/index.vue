<template>
  <div class="project-presentation">
    <pre>{{data}}</pre>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
})
</script>
