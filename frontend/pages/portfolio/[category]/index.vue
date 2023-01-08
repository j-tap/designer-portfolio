<template>
  <div class="page-category">
    <ContentWrap>
      <TitleOutline class="page-category__title" tag="h1">
        {{ category.title }}
      </TitleOutline>
      <ul class="page-category__projects projects-list">
        <li
          v-for="project in projectsList"
          :key="project.name"
          class="projects-list__item"
        >
          <ProjectPreview
            :data="project"
            :to="{
              name: 'portfolio-category-project',
              params: { category: categoryName, project: project.name }
            }"
            title-tag="h2"
            class="more-projects__item-preview"
          />
        </li>
      </ul>
    </ContentWrap>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { ProjectPreview } from '~/components/sections'
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

definePageMeta({
  key: route => route.fullPath
})
</script>

<style lang="scss" src="./style.scss" scoped/>