<template>
  <div class="project-web">
    <img
      v-if="imageTop"
      class="project-web__img-top"
      loading="lazy"
      decoding="async"
      sizes="100vw"
      :srcset="imageTop.srcset"
      :src="imageTop.url"
      :width="imageTop.width"
      :height="imageTop.height"
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
          :srcset="item.srcset"
          sizes="(max-width: 767px) 100vw, 66vw"
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
      loading="lazy"
      decoding="async"
      sizes="100vw"
      :srcset="imageBottom.srcset"
      :src="imageBottom.url"
      :width="imageBottom.width"
      :height="imageBottom.height"
      alt=" "
    >
  </div>
</template>

<script setup>
import { ImgBlock } from '~/components/common'
import { ProjectColors, ProjectFonts } from '~/components/sections'

const { mediaImage } = useMedia()

const props = defineProps({
  data: Object,
})

// Первая картинка проекта — над шрифтами и цветами, последняя (если их больше одной) — в самом низу
const images = computed(() => (props.data.images || []).map(mediaImage))
const imageTop = computed(() => images.value[0] || null)
const imageBottom = computed(() => (images.value.length > 1 ? images.value.at(-1) : null))

const imagesList = computed(() => (props.data.pages || []).flatMap(page => (page.images || []).map(mediaImage)))
</script>

<style lang="scss" src="./style.scss" scoped/>