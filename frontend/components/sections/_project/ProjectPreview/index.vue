<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="project-preview"
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
  </NuxtLink>
  <div
    v-else
    class="project-preview project-preview_unlink"
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
  </div>
</template>

<script setup>
import { ImgBlock } from '~/components/common'

defineProps({
  data: Object,
  to: {
    type: [Object, String],
    default: null,
  },
  titleTag: {
    type: String,
    default: 'figcaption',
  }
})
</script>

<style lang="scss" src="./style.scss" scoped />