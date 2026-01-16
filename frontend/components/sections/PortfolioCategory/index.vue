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
  resetParalax,
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

const localePath = useLocalePath()
const route = useRoute()
const categorySlug = computed(() => route.params.category)
const subcategorySlug = computed(() => route.params.subcategory)

watch(props.category, async (val) => {
  if (!val?.id) {
    display404()
  }
}, { deep: true })

if (process.client) {
  let rafId = null
  let scrollHandler = null

  onMounted(() => {
    resetParalax()
    projectElems.value = []
    
    if (window.innerWidth >= 768) {
      scrollHandler = () => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
          updateProjectsPrlx(props.projects, window.scrollY)
          rafId = null
        })
      }
      window.addEventListener('scroll', scrollHandler, { passive: true })

      nextTick(() => {
        updateProjectsPrlx(props.projects, window.scrollY)
      })
    }
  })

  onBeforeUnmount(() => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    resetParalax()
    projectElems.value = []
  })
}

function setProjectElems (el) {
  if (el) {
    projectElems.value.push(el)
  }
}

function getTo ({ slug }) {
  const isSubCat = !!props.subcategories?.length
  const detailExcludeSubCats = detailExclude.map(v => v.split('/'))
  const isExcluded = detailExclude.some(v => route.path.includes(v)) ||
    (!isSubCat && detailExcludeSubCats.some(([s1, s2]) =>
      route.path.includes(s1) || route.path.includes(s2)
    ))

  if (isExcluded) {
    return null;
  }

  const params = {
    category: categorySlug.value,
    project: slug,
    ...(isSubCat ? { subcategory: subcategorySlug.value || props.subcategories[0].slug } : {}),
  }
  const name = isSubCat ? 'portfolio-category-subcategory-project' : 'portfolio-category-project'

  return localePath({ name, params })
}
</script>

<style lang="scss" src="./style.scss" scoped/>
