<template>
  <div>
    <h1>{{ category.title }}</h1>
    <ul>
      <li v-for="item in projectsList" :key="item.name">
        <NuxtLink :to="{ name: 'portfolio-category-project', params: { category: categoryName, project: item.name } }">
          <img :src="item.preview" :alt="item.name">
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import categories from '~/mocks/categories.js'
import projects from '~/mocks/projects.js'

const route = useRoute()
const categoryName = computed(() => route.params.category)
const category = computed(() => categories.filter(o => o.name === categoryName.value).pop() || {})
const projectsList = computed(() => projects.map(o => ({
  id: o.id,
  name: o.name,
  preview: o.preview,
  title: o.title,
})))
</script>

<style lang="scss" src="./style.scss" scoped/>