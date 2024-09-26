<template>
  <div class="portfolio-project" itemscope itemtype="https://schema.org/Product">
    <ul
      v-if="project.links?.length"
      class="portfolio-project__links links-project"
    >
      <li
        v-for="item in project.links"
        :key="item.id"
        class="links-project__item"
      >
        <NuxtLink
          :to="localePath(item.link)"
          class="links-project__link"
          target="_blank"
          external
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>

    <header class="portfolio-project__head">
      <h1 class="portfolio-project__title" itemprop="name">
        <NuxtLink
          v-if="project.link"
          :to="localePath(project.link)"
          target="_blank"
          external
        >
          {{ project.title }}
        </NuxtLink>
        <template v-else>{{ project.title }}</template>
      </h1>
      <div
        v-if="project.subtitle"
        class="portfolio-project__subtitle"
        itemprop="description"
      >
        {{ project.subtitle }}
      </div>
    </header>

    <ProjectTimes
      v-if="project.time?.start"
      :time="project.time"
      class="portfolio-project__time"
    />

    <ProjectSteps
      v-if="project.steps?.length"
      :steps="project.steps"
      class="portfolio-project__steps"
    />

    <ProjectBack
      class="portfolio-project__back"
      :category-name="categorySlug"
      :project-id="project.id"
    />

    <div class="portfolio-project__content">
      <ProjectPresentation
        v-if="project.presentation"
        :images="project.presentation"
      />
      <Component
        v-else
        :is="projectComponentName"
        :data="project"
      />
    </div>

    <ProjectBack
      class="portfolio-project__back"
      :category-name="categorySlug"
      :project-id="project.id"
    />

    <ProjectMore
      v-if="moreProjects?.length"
      :items="moreProjects"
      class="portfolio-project__more-projects"
    />
  </div>
</template>

<script setup>
import {
  ProjectTimes,
  ProjectSteps,
  ProjectTypeMobile,
  ProjectTypeUiUx,
  ProjectTypeWeb,
  ProjectTypeIdentity,
  ProjectPresentation,
  ProjectMore,
  ProjectBack,
} from '~/components/sections'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  moreProjects: {
    type: Array,
    default: () => [],
  },
  categorySlug: {
    type: String,
    default: null,
  },
})
const categoryToComponent = {
  'mobile-development': ProjectTypeMobile,
  'ui-ux-design': ProjectTypeUiUx,
  'web-design': ProjectTypeWeb,
  'identity': ProjectTypeIdentity,
}
const projectComponentName = computed(() => categoryToComponent[props.categorySlug])
const title = computed(() => `${projectData.value?.title} / ${projectData.value?.categories?.find(o => o.slug === props.categorySlug)?.title}`)
</script>

<style lang="scss" src="./style.scss" scoped/>
