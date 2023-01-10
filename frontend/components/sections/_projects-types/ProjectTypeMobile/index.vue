<template>
  <div class="project-mobile">
    <ProjectViews
      :list="pagesDefault"
      images-size="small"
      class="project-mobile__pages"
    />
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
import { ProjectViews, ProjectColors, ProjectFonts } from '~/components/sections'
import { pageTypes, getPagesByType } from '~/composables/useProject'

const props = defineProps({
  data: Object,
})

const pagesDefault = computed(() => getPagesByType(props.data.pages, pageTypes.default))
</script>

<style lang="scss" src="./style.scss" scoped />