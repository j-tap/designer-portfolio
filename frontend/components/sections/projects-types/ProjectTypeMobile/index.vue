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

    <div class="project-mobile__fonts project-fonts">
      <h2 class="project-fonts__title">{{ $t('project.fonts') }}</h2>
      <ul class="project-fonts__list">
        <li
          v-for="font in props.data.fonts"
          :key="strToNumHash(font)"
          class="project-fonts__item"
        >
          <TitleOutline>{{ font }}</TitleOutline>
        </li>
      </ul>
    </div>

    <div class="project-mobile__colors project-colors">
      <ul class="project-colors__list">
        <li
          v-for="color in props.data.colors"
          :key="strToNumHash(color)"
          class="project-colors__item"
        >
          <div class="project-colors__item-color" :style="`background-color: ${color}`"/>
          <div class="project-colors__item-title">{{ color }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ImagesItems } from '~/components/sections'

const props = defineProps({
  data: Object,
})
</script>

<style lang="scss" src="./style.scss" scoped/>