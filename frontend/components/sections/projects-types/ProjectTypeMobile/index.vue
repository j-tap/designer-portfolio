<template>
  <div class="project-mobile">
    <ul class="project-mobile__pages">
      <li
        v-for="(page, ind) in props.data.pages"
        :key="strToNumHash(page.title)"
        class="project-mobile__pages-item page-item"
      >
        <header class="page-item__header">
          <h2 class="page-item__title">{{ page.title }}</h2>
          <h3 v-if="page.subtitle" class="page-item__subtitle">{{ page.subtitle }}</h3>
        </header>
        <ImagesItems
          :images="page.images"
          :display-hint="ind === 0"
          class="page-item__images-items"
        />
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
import { ImagesItems, ProjectColors, ProjectFonts } from '~/components/sections'

const props = defineProps({
  data: Object,
})
</script>

<style lang="scss" src="./style.scss" scoped/>