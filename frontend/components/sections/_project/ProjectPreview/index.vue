<template>
  <NuxtLink
    :to="to"
    :class="classes"
  >
    <figure class="project-preview__inner">
      <ImgBlock
        class="project-preview__img"
        :src="urlFile(data.preview.url)"
        :src-hover="urlFile(data.preview_hover?.url)"
        :blurhash="data.preview.blurhash"
        :width="data.preview.width"
        :height="data.preview.height"
        :alt="data.slug"
        itemprop
      />
      <Component :is="titleTag" class="project-preview__title">
        {{ data.title }}
      </Component>
    </figure>
  </NuxtLink>
</template>

<script setup>
import { ImgBlock } from '~/components/common'

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