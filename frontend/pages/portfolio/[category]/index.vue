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
          :id="`project-${project.id}`"
          :style="projectStyles[project.id]"
          class="projects-list__item"
        >
          <ProjectPreview
            :data="project"
            :to="isCategoryIdentity ? null : {
              name: 'portfolio-category-project',
              params: { category: categoryName, project: project.name, hash: `project-${project.id}` }
            }"
            title-tag="h2"
            class="projects-list__item-preview"
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
const isCategoryIdentity = computed(() => categoryName.value === 'identity')
const category = computed(() => categories.filter(o => o.name === categoryName.value).pop() || {})
const projectsList = computed(() => projects.map(o => ({
  id: o.id,
  name: o.name,
  preview: o.preview,
  title: o.title,
})))
const projectStyles = ref({})

watch(projectsList, (list) => {
  updateProjectsPrlx(list)
}, { immediate: true })

if (process.client) {
  window.addEventListener('scroll', () => {
    updateProjectsPrlx(projectsList.value, window.scrollY)
  })
}

function updateProjectsPrlx (list, scrl = 0) {
  list.forEach((o, ind) => {
    const speed = 20
    let prlx = 1

    if (ind === 0 || ind % 7 === 0) {
      prlx = 2
    } else if (ind === 1 || ind % 8 === 0) {
      prlx = 4
    } else if (ind === 2 || ind % 9 === 0) {
      prlx = 3
    } else if (ind === 3 || ind % 10 === 0) {
      prlx = 6
    } else if (ind === 4 || ind % 11 === 0) {
      prlx = 3
    } else if (ind === 5 || ind % 12 === 0) {
      prlx = 2
    } else if (ind === 6 || ind % 13 === 0) {
      prlx = 5
    } else if (ind === 7 || ind % 14 === 0) {
      prlx = 2
    }

    const val = scrl / speed * prlx * -1

    projectStyles.value[o.id] = {
      transform: `translateY(${val}px)`,
    }
  })
}

definePageMeta({
  key: route => route.fullPath
})
</script>

<style lang="scss" src="./style.scss" scoped/>