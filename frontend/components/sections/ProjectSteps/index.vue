<template>
  <div class="project-steps">
    <h2 class="project-steps__title">{{ $t('project.steps') }}</h2>
    <ol class="project-steps__list">
      <li
          v-for="item in props.steps"
          :key="item.id"
          class="project-steps__list-item"
      >
        {{ item.title }}
      </li>
    </ol>
  </div>
</template>

<script setup>
const props = defineProps({
  steps: Array,
})
</script>

<style lang="scss" src="./style.scss" scoped />