<template>
  <div class="page-category">
    <ContentWrap>
      <BackLink
        :to="back.to"
        class="page-category__back"
      >
        {{ back.title }}
      </BackLink>

      <TranslationNotice :locale="locale" />

      <div class="page-category__head page-category-head">
        <TitleOutline
          class="page-category-head__title"
          tag="h1"
          :lang="contentLang({ locale })"
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
          :lang="contentLang(project)"
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
import { BackLink, TitleOutline, TranslationNotice } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { ProjectPreview, PortfolioSubcategoriesNav } from '~/components/sections'
import { projectPath } from '~/config/portfolio'

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
  // Язык показанной версии категории или подкатегории: без перевода — язык оригинала
  locale: {
    type: String,
    default: null,
  },
})

const localePath = useLocalePath()
const contentLang = useContentLang()

useParallax(useTemplateRef('listItems'))

function projectLink ({ slug }) {
  const path = projectPath({ category: props.categorySlug, subcategory: props.subcategorySlug }, slug)
  return path && localePath(path)
}
</script>

<style lang="scss" src="./style.scss" scoped/>
