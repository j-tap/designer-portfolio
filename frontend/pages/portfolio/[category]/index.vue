<template>
  <div v-if="isExist" class="page-category">
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
import { metaInfo } from '~/composables/useMeta'
import { find, findBySlug } from '~/composables/useApi'
import {
  updateProjectsPrlx,
  elems as projectElems,
} from '~/composables/useElemsParalax'
import { display404 } from '~/composables/useErrorContent'

const { t } = useI18n()
const route = useRoute()
const categoryName = computed(() => route.params.category)
const isCategoryIdentity = computed(() => categoryName.value === 'identity')

definePageMeta({
  key: route => route.fullPath
})

const projectsResp = ref(null)
const projectsList = computed(() => projectsResp.value?.data || [])
const categoryResp = await findBySlug('category-projects', categoryName.value)
const isExist = !!categoryResp.data

display404(!isExist)

const category = computed(() => categoryResp.data)

if (isExist) {
  projectsResp.value = await find('projects', {
    filters: {
      categories: {
        id: { $in: category.value?.id },
      },
    },
    sort: [
      { time: { start: 'desc', end: 'desc' } },
      { rank: 'asc' },
    ],
    pagination: { pageSize: 99 },
  })

  if (process.client && window.innerWidth >= 768 && projectsList.value?.length > 5) {
    window.addEventListener('scroll', () => {
      updateProjectsPrlx(projectsList.value, window.scrollY)
    })
  }
}

function setProjectElems (el) {
  if (el) {
    // TODO: Need clean after updated
    projectElems.value.push(el)
  }
}

useHead(metaInfo({
  title: category.value?.title,
}))
</script>

<style lang="scss" src="./style.scss" scoped/>