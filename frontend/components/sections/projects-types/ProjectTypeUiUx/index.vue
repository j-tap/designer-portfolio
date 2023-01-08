<template>
  <div class="project-uiux">
    <div class="page-project__content">
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

      <ul>
        <li v-for="font in props.data.fonts" :key="strToNumHash(font)">{{ font }}</li>
      </ul>

      <ul>
        <li v-for="color in props.data.colors" :key="strToNumHash(color)">{{ color }}</li>
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
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
})
</script>

<style lang="scss" src="./style.scss" scoped/>