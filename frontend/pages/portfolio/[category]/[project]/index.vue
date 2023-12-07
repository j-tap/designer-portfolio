<template>
  <div class="page-project">
    <ContentWrap>
      <Transition>
        <div itemscope itemtype="https://schema.org/Product">
          <ul
            v-if="project.links?.length"
            class="page-project__links links-project"
          >
            <li
              v-for="item in project.links"
              :key="item.id"
              class="links-project__item"
            >
              <NuxtLink
                :to="item.link"
                class="links-project__link"
                target="_blank"
                external
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>

          <header class="page-project__head">
            <h1 class="page-project__title" itemprop="name">
              <NuxtLink
                v-if="project.link"
                :to="project.link"
                target="_blank"
                external
              >
                {{ project.title }}
              </NuxtLink>
              <template v-else>{{ project.title }}</template>
            </h1>
            <div
              v-if="project.subtitle"
              class="page-project__subtitle"
              itemprop="description"
            >
              {{ project.subtitle }}
            </div>
          </header>

          <ProjectTimes
            v-if="project.time?.start"
            :time="project.time"
            class="page-project__time"
          />

          <ProjectSteps
            v-if="project.steps?.length"
            :steps="project.steps"
            class="page-project__steps"
          />

          <ProjectBack
            class="page-project__back"
            :category-name="categorySlug"
            :project-id="project.id"
          />

          <div class="page-project__content">
            <Component
              :is="projectComponentName"
              :data="project"
            />
          </div>

          <ProjectBack
            class="page-project__back"
            :category-name="categorySlug"
            :project-id="project.id"
          />

          <ProjectMore
            v-if="moreProjectsList?.length"
            :items="moreProjectsList"
            class="page-project__more-projects"
          />
        </div>
      </Transition>
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import {
  ProjectTimes,
  ProjectSteps,
  ProjectTypeMobile,
  ProjectTypeUiUx,
  ProjectTypeWeb,
  ProjectTypeIdentity,
  ProjectMore,
  ProjectBack,
} from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { find, findBySlug, serverFetch } from '~/composables/useApi'
import { display404 } from '~/composables/useErrorContent'

const categoryToComponent = {
  'mobile-development': ProjectTypeMobile,
  'ui-ux-design': ProjectTypeUiUx,
  'web-design': ProjectTypeWeb,
  'identity': ProjectTypeIdentity,
}
const route = useRoute()
const router = useRouter()
const categorySlug = computed(() => route.params.category)
const projectSlug = computed(() => route.params.project)
const projectData = serverFetch('projects', {
  slug: projectSlug.value,
  filters: {
    categories: { slug: { $in: categorySlug.value } },
  },
}, {}, 'findBySlug')
const project = computed(() => {
  const result = { ...projectData.value }
  if (result?.pages) {
    result.pages = result.pages.filter(o => o.active !== false)
  }
  return result
})
const moreProjects = serverFetch('projects', {
  filters: {
    slug: { $ne: projectSlug.value },
    categories: { slug: { $in: categorySlug.value } },
  },
  pagination: { pageSize: 15 },
}, [])
const moreProjectsList = computed(() => moreProjects.value.sort(() => 0.5 - Math.random()) || [])
const projectComponentName = computed(() => categoryToComponent[categorySlug.value])
const title = computed(() => `${projectData.value?.title} / ${projectData.value?.categories?.find(o => o.slug === categorySlug.value)?.title}`)
const metaDescr = computed(() => projectData.value?.meta?.description || projectData.value?.subtitle)
const metaImg = computed(() =>
    projectData.value.preview_social?.url ||
    projectData.value.preview?.formats.medium.url ||
    projectData.value.pages?.[0]?.images?.[0].formats.medium.url
)
const metaKeywords = computed(() => projectData.value?.meta?.keywords)

watch(projectData, async (val) => {
  if (!val?.id) {
    display404()
  }
}, { deep: true })

useHead(metaInfo({
  title,
  description: metaDescr,
  image: metaImg,
  keywords: metaKeywords,
}))
</script>

<style lang="scss" src="./style.scss" scoped/>