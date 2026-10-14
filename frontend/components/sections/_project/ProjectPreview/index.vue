<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to || undefined"
    :class="['project-preview', { 'project-preview_unlink': !to }]"
  >
    <figure class="project-preview__inner">
      <ImgBlock
        class="project-preview__img"
        :src="mediaUrl(data.preview.url)"
        :src-hover="mediaUrl(data.preview_hover?.url)"
        :blurhash="data.preview.blurhash"
        :width="data.preview.width"
        :height="data.preview.height"
        :alt="data.title || data.slug"
        :eager="eager"
        itemprop
      />
      <component :is="titleTag" class="project-preview__title">
        {{ data.title }}
      </component>
    </figure>
  </component>
</template>

<script setup>
import { NuxtLink } from '#components'
import { ImgBlock } from '~/components/common'

const { mediaUrl } = useMedia()

defineProps({
  data: Object,
  to: {
    type: [Object, String],
    default: null,
  },
  titleTag: {
    type: String,
    default: 'figcaption',
  },
  eager: Boolean,
})
</script>

<style lang="scss" src="./style.scss" scoped />