<template>
  <NuxtLink
    :to="to"
    :class="classes"
  >
    <figure class="project-preview__inner">
      <img
        v-if="data.preview"
        :src="data.preview.formats.medium.url"
        :alt="data.slug"
        class="project-preview__img"
      >
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
const classes = computed(() => ['project-preview', { 'project-preview_unlink': !props.to }])
</script>

<style lang="scss" src="./style.scss" scoped />