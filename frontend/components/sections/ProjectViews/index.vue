<template>
  <ul class="project-views">
    <li
      v-for="(item, ind) in list"
      :key="strToNumHash(item.title)"
      class="project-views__item"
    >
      <ProjectViewsItem
        :data="item"
        :display-hint="ind === 0"
        :images-size="imagesSize"
      />
    </li>
  </ul>
</template>

<script setup>
import { ProjectViewsItem } from '~/components/sections'

const props = defineProps({
  list: Array,
  imagesSize: String,
})
</script>

<style lang="scss" src="./style.scss" scoped />