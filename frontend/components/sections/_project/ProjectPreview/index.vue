<template>
  <component
    :is="wrapTag"
    v-bind="wrapAttrs"
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
      <component :is="titleTag" class="project-preview__title">
        {{ data.title }}
      </component>
    </figure>
  </component>
</template>

<script setup>
import { ImgBlock } from '~/components/common'

const props = defineProps({
  data: Object,
  to: {
    type: Object,
    default: null,
  },
  titleTag: {
    type: String,
    default: 'figcaption',
  }
})
const wrapTag = computed(() => props.to ? resolveComponent('NuxtLink') : 'div')
const wrapAttrs = computed(() => ({
  class: ['project-preview', { 'project-preview_unlink': !props.to }],
  ...(props.to ? { to: props.to } : {}),
}))
</script>

<style lang="scss" src="./style.scss" scoped />