<template>
  <div class="project-web">
    <img
      v-if="imageTop"
      class="project-web__img-top"
      :src="mediaUrl(imageTop.url)"
      alt=" "
    >
    <ProjectFonts
      :items="props.data.fonts"
      class="project-web__fonts"
    />
    <ProjectColors
      :items="props.data.colors"
      class="project-web__colors"
    />
    <ul v-if="imagesList.length" class="project-web__images web-images">
      <li
        v-for="item in imagesList"
        :key="item.id"
        class="web-images__item"
      >
        <ImgBlock
          class="web-images__img"
          :src="item.url"
          :blurhash="item.blurhash"
          :width="item.width"
          :height="item.height"
          itemprop
          alt=" "
        />
      </li>
    </ul>
    <img
      v-if="imageBottom"
      class="project-web__img-bottom"
      :src="mediaUrl(imageBottom.url)"
      alt=" "
    >
  </div>
</template>

<script setup>
import { ImgBlock } from '~/components/common'
import { ProjectColors, ProjectFonts } from '~/components/sections'

const { mediaUrl, mediaImage } = useMedia()

const props = defineProps({
  data: Object,
})

// Первая картинка проекта — над шрифтами и цветами, последняя (если их больше одной) — в самом низу
const images = computed(() => props.data.images || [])
const imageTop = computed(() => images.value[0] || null)
const imageBottom = computed(() => (images.value.length > 1 ? images.value.at(-1) : null))

const imagesList = computed(() => (props.data.pages || []).flatMap(page => (page.images || []).map(mediaImage)))
</script>

<style lang="scss" src="./style.scss" scoped/>