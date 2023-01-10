<template>
  <div class="project-web">
    <img class="project-web__img-top" :src="imageTop.src" alt=" ">
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
        v-for="img in imagesList"
        :key="strToNumHash(img.src)"
        class="web-images__item"
      >
        <img class="web-images__img" :src="img.src" alt=" ">
      </li>
    </ul>
    <img class="project-web__img-bottom" :src="imageBottom.src" alt=" ">
  </div>
</template>

<script setup>
import { ProjectColors, ProjectFonts } from '~/components/sections'

const props = defineProps({
  data: Object,
})
const imageTop = computed(() => props.data.images[0])
const imageBottom = computed(() => props.data.images[props.data.images.length - 1])
const page = computed(() => props.data.pages[0] || {})
const imagesList = computed(() => page.value.images || [])
</script>

<style lang="scss" src="./style.scss" scoped/>