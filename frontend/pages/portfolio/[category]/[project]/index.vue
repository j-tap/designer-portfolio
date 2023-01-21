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

      <div class="page-project__back">
        <NuxtLink
          :to="{
            name: 'portfolio-category',
            params: { category: categoryName },
            hash: `#project-${project.id}`,
          }"
        >
          &larr; {{ $t('portfolio.back_to_portfolio') }}
        </NuxtLink>
      </div>

      <div class="page-project__content">
        <Component :is="projectComponentName" :data="project" />
      </div>

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
} from '~/components/sections'
import { setMeta } from '~/composables/useMeta'
import {find, findBySlug} from "~/composables/useApi";

const categoryToComponent = {
  'mobile-development': ProjectTypeMobile,
  'ui-ux-design': ProjectTypeUiUx,
  'web-design': ProjectTypeWeb,
  'identity': ProjectTypeIdentity,
}
const route = useRoute()

const projectComponentName = shallowRef('')
const categoryName = computed(() => route.params.category)
const { data: project } = await findBySlug(
  'projects',
  route.params.project,
)
const { data: moreProjectsList } = await find(
  'projects',
  {
    filters: {
      categories: 0, // { id: { $in: project.categories.map((o) => o.id) } },
      id: { $ne: project.id },
    },
  }
)

onMounted(() => {
  projectComponentName.value = categoryToComponent[categoryName.value]
})

setMeta({
  title: `${project.value?.title} / ${categoryName.value}`,
})
</script>

<style lang="scss" src="./style.scss" scoped/>