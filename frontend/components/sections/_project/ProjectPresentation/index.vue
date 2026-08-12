<script setup>
import { ImgBlock } from '~/components/common'

const props = defineProps({
  images: Array,
})

const sortedImages = computed(() => {
  const list = props.images ?? []
  return [...list].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
})
</script>

<template>
  <div class="project-presentation">
    <ImgBlock
      v-for="(img, index) in sortedImages"
      :key="img.id"
      :eager="index === 0"
      :src="urlFile(img.url)"
      :src-lite="urlFile(img.formats?.large?.url || img.url)"
      :blurhash="img.blurhash"
      :width="img.width"
      :height="img.height"
      :alt="img.slug || img.name"
      class="project-presentation__img"
      itemprop
    />
  </div>
</template>

<style lang="scss" src="./style.scss" scoped />
