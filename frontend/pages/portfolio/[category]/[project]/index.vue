<template>
  <div class="page-project">
    <ContentWrap>
      <h1 class="page-project__title">{{ project.title }}</h1>

      <ProjectTimes
        v-if="project.time.start"
        :time="project.time"
        class="page-project__time"
      />

      <ProjectSteps
        v-if="project.steps.length"
        :steps="project.steps"
        class="page-project__steps"
      />

      <div class="page-project__back">
        <NuxtLink
          :to="{ name: 'portfolio-category', params: { category: categoryName } }"
        >
          &larr; {{ $t('portfolio.back_to_portfolio') }}
        </NuxtLink>
      </div>

      <div class="page-project__content">
        <Component :is="projectComponentName" :data="project" />
      </div>

      <ProjectMore
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
} from '~/components/sections'

import projects from '~/mocks/projects.js'

const categoryToComponent = {
  'mobile-development': ProjectTypeMobile,
  'ui-ux-design': ProjectTypeUiUx,
  'web-design': ProjectTypeWeb,
  'identity': ProjectTypeIdentity,
}
const route = useRoute()
const categoryName = computed(() => route.params.category)
const project = computed(() => projects.filter(o => o.name === route.params.project).pop() || {})
const projectComponentName = shallowRef('')
const moreProjectsList = computed(() => projects
    .map(o => ({
      id: o.id,
      name: o.name,
      preview: o.preview,
      title: o.title,
    }))
    .filter(o => o.id !== project.value.id)
)

onMounted(() => {
  projectComponentName.value = categoryToComponent[categoryName.value]
})
</script>

<style lang="scss" src="./style.scss" scoped/>