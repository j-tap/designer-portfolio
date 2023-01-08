<template>
  <NuxtLink
    :to="to"
    class="project-preview"
  >
    <figure class="project-preview__inner">
      <img class="project-preview__img" :src="data.preview" :alt="data.name">
      <Component :is="titleTag" class="project-preview__title">
        {{ data.title }}
      </Component>
    </figure>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  data: Object,
  to: Object,
  titleTag: {
    type: String,
    default: 'figcaption',
  }
})
</script>

<style lang="scss" src="./style.scss" scoped />