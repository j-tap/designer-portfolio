<template>
  <div class="page-project">
    <TitleOutline class="page-project__title" tag="h1">
      {{ project.title }}
    </TitleOutline>
    <ul>
      <li v-for="page in project.pages" :key="strToNumHash(page.title)">
        <h2>{{ page.title }}</h2>
        <h3 v-if="page.subtitle">{{ page.subtitle }}</h3>
        <ul v-if="page.images.length">
          <li v-for="img in page.images" :key="strToNumHash(img.src)">
            <img :src="img.src" alt=" ">
          </li>
        </ul>
      </li>
    </ul>

    <ul>
      <li v-for="font in project.fonts" :key="strToNumHash(font)">{{ font }}</li>
    </ul>

    <ul>
      <li v-for="color in project.colors" :key="strToNumHash(color)">{{ color }}</li>
    </ul>

    <ul>
      <li v-for="pageOther in project.pagesOther" :key="strToNumHash(pageOther.title)">
        <h2>{{ pageOther.title }}</h2>
        <h3 v-if="pageOther.subtitle">{{ pageOther.subtitle }}</h3>
        <ul v-if="pageOther.images.length">
          <li v-for="img in pageOther.images" :key="strToNumHash(img.src)">
            <img :src="img.src" alt=" ">
          </li>
        </ul>
      </li>
    </ul>
    <pre>{{ project }}</pre>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import projects from '~/mocks/projects.js'

const route = useRoute()
const project = computed(() => projects.filter(o => o.name === route.params.project).pop() || {})
</script>

<style lang="scss" src="./style.scss" scoped/>