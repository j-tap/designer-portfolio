<template>
  <div class="page-category">
    <ContentWrap>
      <TitleOutline v-if="category" class="page-category__title" tag="h1">
        {{ category.title }}
      </TitleOutline>

      <ul v-if="projectsList.length" class="page-category__projects projects-list">
        <li
          v-for="project in projectsList"
          :key="project.slug"
          :id="`project-${project.id}`"
          :ref="setProjectElems"
          class="projects-list__item"
        >
          <ProjectPreview
            :data="project"
            :to="isCategoryIdentity ? null : {
              name: 'portfolio-category-project',
              params: {
                category: categoryName,
                project: project.slug,
              }
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
import { setMeta } from '~/composables/useMeta'
import { find, findBySlug } from '~/composables/useApi';
import {
  updateProjectsPrlx,
  elems as projectElems, elems,
} from '~/composables/useElemsParalax'

const { t } = useI18n()
const route = useRoute()
const categoryName = computed(() => route.params.category)
const isCategoryIdentity = computed(() => categoryName.value === 'identity')

const { data: category } = await findBySlug('category-projects', categoryName.value)
const { data: projectsList } = await find('projects', {
  filters: {
    categories: {
      id: { $in: category?.id },
    },
  },
})

if (process.client && elems.value.length > 5) {
  window.addEventListener('scroll', () => {
    updateProjectsPrlx(projectsList.value, window.scrollY)
  })
}

function setProjectElems (el) {
  if (el) {
    // TODO: Need clean after updated
    projectElems.value.push(el)
  }
}

setMeta({
  title: category.value?.title,
})

definePageMeta({
  key: route => route.fullPath
})
</script>

<style lang="scss" src="./style.scss" scoped/>