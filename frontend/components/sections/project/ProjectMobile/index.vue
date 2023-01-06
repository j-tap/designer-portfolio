<template>
  <div class="project-mobile">
    <ul class="project-mobile__pages">
      <li
        v-for="page in props.data.pages"
        :key="strToNumHash(page.title)"
        class="project-mobile__pages-item page-item"
      >
        <header class="page-item__header">
          <h2 class="page-item__title">{{ page.title }}</h2>
          <h3 v-if="page.subtitle" class="page-item__subtitle">{{ page.subtitle }}</h3>
        </header>
        <ImagesItems :images="page.images" class="page-item__images-items" />
      </li>
    </ul>

    <ul class="project-mobile__fonts fonts-list">
      <li v-for="font in props.data.fonts" :key="strToNumHash(font)" class="fonts-list__item">
        <TitleOutline>{{ font }}</TitleOutline>
      </li>
    </ul>

    <ul class="project-mobile__colors colors-list">
      <li v-for="color in props.data.colors" :key="strToNumHash(color)" class="colors-list__item">
        <div class="colors-list__item-color" :style="`background-color: ${color}`"/>
        <div class="colors-list__item-title">{{ color }}</div>
      </li>
    </ul>

    <ul>
      <li v-for="pageOther in props.data.pagesOther" :key="strToNumHash(pageOther.title)">
        <h2>{{ pageOther.title }}</h2>
        <h3 v-if="pageOther.subtitle">{{ pageOther.subtitle }}</h3>
        <ul v-if="pageOther.images.length">
          <li v-for="img in pageOther.images" :key="strToNumHash(img.src)">
            <img :src="img.src" alt=" ">
          </li>
        </ul>
      </li>
    </ul>
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