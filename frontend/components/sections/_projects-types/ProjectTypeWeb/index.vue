<template>
  <div class="project-web">
    <img v-if="imageTop" class="project-web__img-top" :src="imageTop.src" alt=" ">
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
        :key="strToNumHash(item.src)"
        class="web-images__item"
      >
        <img class="web-images__img" :src="item.src" alt=" ">
      </li>
    </ul>
    <img v-if="imageBottom" class="project-web__img-bottom" :src="imageBottom.src" alt=" ">
  </div>
</template>

<script setup>
import { ProjectColors, ProjectFonts } from '~/components/sections'

const props = defineProps({
  data: Object,
})
const imgs = computed(() => props.data.images)
const imageTop = computed(() => imgs.value ? imgs.value[0] : null)
const imageBottom = computed(() => imgs.value ? imgs.value[imgs.value.length - 1] : null)
const imagesList = computed(() => {
  if (props.data.pages) {
    const imgs = []
    props.data.pages.forEach(o => {
      if (o.images) {
        imgs.push(...o.images)
      }
    })
    return imgs
  }
  return []
})
</script>

<style lang="scss" src="./style.scss" scoped/>