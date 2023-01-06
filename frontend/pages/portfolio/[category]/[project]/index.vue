<template>
  <div class="page-project">
    <ContentWrap>
      <h1 class="page-project__title">
        {{ project.title }}
      </h1>
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
    </ContentWrap>
    <pre>{{ project }}</pre>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { ProjectMobile, ProjectUiUx } from '~/components/sections'
import projects from '~/mocks/projects.js'

const categoryToComponent = {
  'mobile-development': ProjectMobile,
  'ui-ux-design': ProjectUiUx,
}
const route = useRoute()
const categoryName = computed(() => route.params.category)
const project = computed(() => projects.filter(o => o.name === route.params.project).pop() || {})
const projectComponentName = shallowRef('')

onMounted(() => {
  projectComponentName.value = categoryToComponent[categoryName.value]
})
</script>

<style lang="scss" src="./style.scss" scoped/>