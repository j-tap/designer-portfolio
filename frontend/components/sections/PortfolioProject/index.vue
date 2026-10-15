<script setup>
import {
  ProjectTimes,
  ProjectSteps,
  ProjectTypeMobile,
  ProjectTypeUiUx,
  ProjectTypeWeb,
  ProjectPresentation,
  ProjectMore,
  ProjectBack,
} from '~/components/sections'
import { TranslationNotice } from '~/components/common'
import { portfolioPath } from '~/config/portfolio'
import { safeUrl } from '~/utils/url'

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
    required: true,
  },
  // Подкатегория из адреса проекта: «Назад» и «Ещё проекты» ведут в её раздел
  subcategorySlug: {
    type: String,
    default: null,
  },
})

// Раскладка страницы проекта зависит от категории; у остальных категорий (identity)
// кроме шапки проекта ничего нет
const categoryToComponent = {
  'mobile-development': ProjectTypeMobile,
  'ui-ux-design': ProjectTypeUiUx,
  'web-design': ProjectTypeWeb,
}

const contentLang = useContentLang()

const projectComponent = computed(() => categoryToComponent[props.categorySlug])
const listPath = computed(() => portfolioPath(props.categorySlug, props.subcategorySlug))
const presentationImages = computed(() => (Array.isArray(props.project.presentation) ? props.project.presentation : []))
const links = computed(() => (props.project.links || [])
  .map(item => ({ ...item, href: safeUrl(item.link) }))
  .filter(item => item.href))
</script>

<template>
  <div class="portfolio-project" :lang="contentLang(project)">
    <ul
      v-if="links.length"
      class="portfolio-project__links links-project"
    >
      <li
        v-for="item in links"
        :key="item.id"
        class="links-project__item"
      >
        <NuxtLink
          :to="item.href"
          class="links-project__link"
          target="_blank"
          external
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>

    <header class="portfolio-project__head">
      <TranslationNotice :locale="project.locale" />
      <h1 class="portfolio-project__title">
        <NuxtLink
          v-if="safeUrl(project.link)"
          :to="safeUrl(project.link)"
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
      :list-path="listPath"
      :project-id="project.id"
    />

    <div class="portfolio-project__content">
      <ProjectPresentation
        v-if="presentationImages.length"
        :images="presentationImages"
      />
      <Component
        :is="projectComponent"
        v-else-if="projectComponent"
        :data="project"
      />
    </div>

    <ProjectBack
      class="portfolio-project__back"
      :list-path="listPath"
      :project-id="project.id"
    />

    <ProjectMore
      v-if="moreProjects.length"
      :items="moreProjects"
      :category-slug="categorySlug"
      :subcategory-slug="subcategorySlug"
      class="portfolio-project__more-projects"
    />
  </div>
</template>

<style lang="scss" src="./style.scss" scoped/>
