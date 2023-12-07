<template>
  <div class="page-category">
    <ContentWrap>
      <BackLink
        :to="{ name: 'portfolio' }"
        class="page-category__back"
      >
        {{ $t('portfolio.back_to_portfolio') }}
      </BackLink>

      <TitleOutline
        class="page-category__title"
        tag="h1"
      >
        {{ title }}
      </TitleOutline>

      <ul class="page-category__projects projects-list">
        <li
          v-for="project in projects"
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
                category: categorySlug,
                project: project.slug,
              }
            }"
            title-tag="h2"
            class="projects-list__item-preview"
          />
        </li>
      </ul>

      <BackLink
        v-if="projects.length > 1"
        :to="{ name: 'portfolio' }"
        class="page-category__back"
      >
        {{ $t('portfolio.back_to_portfolio') }}
      </BackLink>
    </ContentWrap>
  </div>
</template>

<script setup>
import { BackLink, TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { ProjectPreview } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch } from '~/composables/useApi'
import {
  updateProjectsPrlx,
  elems as projectElems,
} from '~/composables/useElemsParalax'
import { display404 } from '~/composables/useErrorContent'

const { t } = useI18n()
const route = useRoute()
const categorySlug = computed(() => route.params.category)
const isCategoryIdentity = computed(() => categorySlug.value === 'identity')

definePageMeta({
  key: route => route.fullPath
})

const projects = serverFetch('projects', {
  filters: {
    categories: { slug: { $in: categorySlug.value } },
  },
  sort: [
    { time: { start: 'desc', end: 'desc' } },
    { rank: 'asc' },
  ],
  pagination: { pageSize: 99 },
}, [])
const category = serverFetch('category-projects', {
  slug: categorySlug.value
}, {}, 'findBySlug')
const title = computed(() => category.value?.title)

watch(category, async (val) => {
  if (!val?.id) {
    display404()
  }
}, { deep: true })

scrollHandler()

function scrollHandler () {
  if (process.client && window.innerWidth >= 768 && projects.value?.length > 5) {
    window.addEventListener('scroll', () => {
      updateProjectsPrlx(projects.value, window.scrollY)
    })
  }
}

function setProjectElems (el) {
  if (el) {
    // TODO: Need clean after updated
    projectElems.value.push(el)
  }
}

useHead(metaInfo({ title }))
</script>

<style lang="scss" src="./style.scss" scoped/>