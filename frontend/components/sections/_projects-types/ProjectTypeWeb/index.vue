<template>
  <div class="project-web">
    <img
      v-if="imageTop"
      class="project-web__img-top"
      :src="urlFile(imageTop.url)"
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
      :src="urlFile(imageBottom.url)"
      alt=" "
    >
  </div>
</template>

<script setup>
import { ImgBlock } from '~/components/common'
import { ProjectColors, ProjectFonts } from '~/components/sections'
import {getFormatImages} from "~/composables/useApi";

const props = defineProps({
  data: Object,
})
const imgs = computed(() => props.data.images)

const imageTop = computed(() => imgs.value ? imgs.value[0] : null)
const imageBottom = computed(() => imgs.value && imgs.value > 1 ? imgs.value[imgs.value.length - 1] : null)

const imagesList = computed(() => {
  if (props.data.pages) {
    const imgs = []
    props.data.pages.forEach(o => {
      if (o.images) {
        o.images.forEach(p => {
          imgs.push(getFormatImages(p))
        })
      }
    })
    return imgs
  }
  return []
})
</script>

<style lang="scss" src="./style.scss" scoped/>