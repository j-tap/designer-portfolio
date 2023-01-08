<template>
  <div class="project-web">
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