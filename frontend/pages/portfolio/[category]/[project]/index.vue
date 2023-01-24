<template>
  <div class="page-project">
    <ContentWrap>
      <ul v-if="project.links?.length" class="page-project__links links-project">
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
        <h1 class="page-project__title">{{ project.title }}</h1>
        <div v-if="project.subtitle" class="page-project__subtitle">{{ project.subtitle }}</div>
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
        :category-name="categoryName"
        :project-id="project.id"
      />

      <div class="page-project__content">
        <Component :is="projectComponentName" :data="project" />
      </div>

      <ProjectBack
        class="page-project__back"
        :category-name="categoryName"
        :project-id="project.id"
      />

      <ProjectMore
        v-if="moreProjectsList?.length"
        :items="moreProjectsList"
        class="page-project__more-projects"
      />
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
import { find, findBySlug } from "~/composables/useApi";

const categoryToComponent = {
  'mobile-development': ProjectTypeMobile,
  'ui-ux-design': ProjectTypeUiUx,
  'web-design': ProjectTypeWeb,
  'identity': ProjectTypeIdentity,
}
const route = useRoute()

const projectComponentName = shallowRef('')
const categoryName = computed(() => route.params.category)
const projectsResp = await findBySlug(
  'projects',
  route.params.project,
)
const project = computed(() => projectsResp.data)

useHead(metaInfo({
  title: `${project.value?.title} / ${categoryName.value}`,
  description: project.value?.subtitle,
  image: project.value?.preview_social?.url || project.value?.preview.formats.medium.url,
}))

const moreProjectsResp = await find(
  'projects',
  {
    filters: {
      id: { $ne: project.value?.id },
      categories: { id: { $in: project.value?.categories.map((o) => o.id) } },
    },
    pagination: { pageSize: 15 },
  }
)
const moreProjectsList = computed(() => moreProjectsResp?.data.length ?
    moreProjectsResp.data.sort(() => 0.5 - Math.random()) : [])

onMounted(() => {
  projectComponentName.value = categoryToComponent[categoryName.value]
})
</script>

<style lang="scss" src="./style.scss" scoped/>