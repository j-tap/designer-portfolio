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
          v-for="project in projects"
          :key="project.slug"
          :id="`project-${project.id}`"
          :ref="setProjectElems"
          class="projects-list__item"
        >
          <ProjectPreview
            :data="project"
            :to="getTo(project)"
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
import {
  updateProjectsPrlx,
  elems as projectElems,
} from '~/composables/useElemsParalax'
import { display404 } from '~/composables/useErrorContent'
import { detailExclude } from '~/config/portfolio'

const props = defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
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

const { t } = useI18n()
const route = useRoute()
const categorySlug = computed(() => route.params.category)
const subcategorySlug = computed(() => route.params.subcategory)

watch(props.category, async (val) => {
  if (!val?.id) {
    display404()
  }
}, { deep: true })

scrollHandler()

function scrollHandler () {
  if (process.client && window.innerWidth >= 768 && props.projects.value?.length > 5) {
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

function getTo ({ slug }) {
  if (detailExclude.some(v => route.path.includes(v))) {
    return null
  }

  const params = {
    category: categorySlug.value,
    project: slug,
    ...(props.subcategories?.length ? { subcategory: subcategorySlug.value || props.subcategories[0].slug } : {}),
  }
  const name = props.subcategories?.length ? 'portfolio-category-subcategory-project' : 'portfolio-category-project'

  return { name, params }
}
</script>

<style lang="scss" src="./style.scss" scoped/>
