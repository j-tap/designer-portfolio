<template>
  <div class="page-category">
    <ContentWrap>
      <BackLink
        :to="back.to"
        class="page-category__back"
      >
        {{ back.title }}
      </BackLink>

      <div class="page-category__head page-category-head">
        <TitleOutline
          class="page-category-head__title"
          tag="h1"
        >
          {{ title }}
        </TitleOutline>

        <PortfolioSubcategoriesNav
          v-if="subcategories?.length"
          :active="category"
          :items="subcategories"
          class="page-category-head__nav"
        />
      </div>

      <ul class="page-category__projects projects-list">
        <li
          v-for="(project, index) in projects"
          :key="project.slug"
          :id="`project-${project.id}`"
          ref="listItems"
          :data-index="index"
          class="projects-list__item"
        >
          <ProjectPreview
            :data="project"
            :to="projectLink(project)"
            :eager="index === 0"
            title-tag="h2"
            class="projects-list__item-preview"
          />
        </li>
      </ul>

      <BackLink
        v-if="projects.length > 1"
        :to="back.to"
        class="page-category__back"
      >
        {{ back.title }}
      </BackLink>
    </ContentWrap>
  </div>
</template>

<script setup>
import { BackLink, TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { ProjectPreview, PortfolioSubcategoriesNav } from '~/components/sections'
import { hasProjectPages, portfolioPath } from '~/config/portfolio'

const props = defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
  // Слаги категории и подкатегории списка: из них строятся ссылки на проекты
  categorySlug: {
    type: String,
    required: true,
  },
  subcategorySlug: {
    type: String,
    default: null,
  },
  // Текущая подкатегория (подсвечивается в навигации) и все подкатегории категории
  category: {
    type: Object,
    default: () => ({}),
  },
  subcategories: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: null,
  },
  back: {
    type: Object,
    default: () => ({}),
  },
})

const localePath = useLocalePath()

useParallax(useTemplateRef('listItems'))

function projectLink ({ slug }) {
  const slugs = { category: props.categorySlug, subcategory: props.subcategorySlug }
  return hasProjectPages(slugs) ? localePath(portfolioPath(slugs.category, slugs.subcategory, slug)) : null
}
</script>

<style lang="scss" src="./style.scss" scoped/>
