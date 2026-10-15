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
        :srcset="mediaSrcset(data.preview)"
        :src-hover="mediaUrl(data.preview_hover?.url)"
        :srcset-hover="mediaSrcset(data.preview_hover)"
        :sizes="sizes"
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

const { mediaUrl, mediaSrcset } = useMedia()

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
  // В списке работ превью на телефоне во всю ширину, на больших экранах — не шире 55% экрана
  sizes: {
    type: String,
    default: '(max-width: 767px) 100vw, 55vw',
  },
})
</script>

<style lang="scss" src="./style.scss" scoped />