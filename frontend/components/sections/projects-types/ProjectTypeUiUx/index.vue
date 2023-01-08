<template>
  <div class="project-uiux">
    <ul>
      <li v-for="page in props.data.pages" :key="strToNumHash(page.title)">
        <h2>{{ page.title }}</h2>
        <h3 v-if="page.subtitle">{{ page.subtitle }}</h3>
        <ul v-if="page.images.length">
          <li v-for="img in page.images" :key="strToNumHash(img.src)">
            <img :src="img.src" alt=" ">
          </li>
        </ul>
      </li>
    </ul>

    <ProjectFonts
      :items="props.data.fonts"
      class="project-mobile__fonts"
    />
    <ProjectColors
      :items="props.data.colors"
      class="project-mobile__colors"
    />
  </div>
</template>

<script setup>
import { ProjectColors, ProjectFonts } from '~/components/sections'

const props = defineProps({
  data: Object,
})
</script>

<style lang="scss" src="./style.scss" scoped/>