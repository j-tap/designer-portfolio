<template>
  <div class="project-presentation">
    <ImgBlock
      v-for="img in images"
      :key="img.id"
      :src="urlFile(img.url)"
      :src-lite="urlFile(img.formats.large.url)"
      :blurhash="img.blurhash"
      :width="img.width"
      :height="img.height"
      :alt="img.slug"
      class="project-presentation__img"
      itemprop
    />
  </div>
</template>

<script setup>
import { ImgBlock } from '~/components/common'

defineProps({
  images: Array,
})
</script>

<style lang="scss" src="./style.scss" scoped />
