<template>
  <div class="page-category">
    <ContentWrap>
      <PortfolioCategory
        :projects="projects"
        :category="category"
        :subcategories="subcategories"
        :title="title"
        :back="{
          to: { name: 'portfolio' },
          title: t('portfolio.back_to_portfolio'),
        }"
      />
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { PortfolioCategory } from '~/components/sections'
import { updateProjectsPrlx } from '~/composables/useElemsParalax'
import { metaInfo } from '~/composables/useMeta'
import { useStructuredData } from '~/composables/useStructuredData'
import { serverFetch } from '~/composables/useApi'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const categorySlug = computed(() => route.params.category)

definePageMeta({
  key: route => route.fullPath
})

const projects = serverFetch('projects', {
  filters: {
    categories: { slug: { $in: categorySlug.value } },
  },
  sort: [
    { time: { start: 'desc', end: 'desc' } },
    { rank: 'asc' },
  ],
  pagination: { pageSize: 99 },
}, [])
const category = serverFetch('category-projects', {
  slug: categorySlug.value
}, {}, 'findBySlug')
const subcategories = computed(() => category.value?.subcategories?.sort((a, b) => a.rank - b.rank) || [])
const title = computed(() => category.value?.title)

watch(category, async (val) => {
  if (subcategories.value?.length) {
    router.push(localePath({
      name: 'portfolio-category-subcategory',
      params: {
        category: categorySlug.value,
        subcategory: subcategories.value[0].slug,
      },
    }))
  }
  if (!val?.id) {
    display404()
  }
}, { deep: true })

if (process.client) {
  let rafId = null
  let scrollHandler = null

  onMounted(() => {
    if (window.innerWidth >= 768 && projects.value?.length > 5) {
      scrollHandler = () => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
          updateProjectsPrlx(projects.value, window.scrollY)
          rafId = null
        })
      }
      window.addEventListener('scroll', scrollHandler, { passive: true })
    }
  })

  onBeforeUnmount(() => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })
}

useHead(metaInfo({ title }))

const breadcrumbs = computed(() => {
  if (!category.value) return null
  
  return [
    { name: t('menu.portfolio') || 'Portfolio', url: '/portfolio' },
    { name: category.value.title, url: route.path },
  ]
})

const collectionData = computed(() => category.value ? {
  title: category.value.title,
  description: category.value.description || category.value.title,
  items: (projects.value || []).map(project => ({
    title: project.title,
    url: `/portfolio/${categorySlug.value}/${project.slug}`,
  })),
} : null)

const { getStructuredData } = useStructuredData('collection', {
  collection: collectionData,
  breadcrumbs: breadcrumbs,
})

watch(getStructuredData, (schemas) => {
  if (schemas && schemas.length > 0) {
    useHead({
      script: schemas.map((schema, index) => ({
        type: 'application/ld+json',
        children: JSON.stringify(schema),
        key: `structured-data-${index}`,
      })),
    })
  }
}, { immediate: true, deep: true })
</script>
