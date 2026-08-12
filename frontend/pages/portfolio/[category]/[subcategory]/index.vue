<template>
  <div class="page-subcategory">
    <ContentWrap>
      <PortfolioCategory
        :projects="projects"
        :category="subcategory"
        :subcategories="subcategories"
        :title="title"
        :back="{
          to: { name: 'portfolio-category', params: { category: category.slug } },
          title: t('portfolio.back_to_{category}', { category: category.title }),
        }"
      />
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch } from '~/composables/useApi'
import { PortfolioCategory } from '~/components/sections'
import { display404 } from '~/composables/useErrorContent'
import { useStructuredData } from '~/composables/useStructuredData'

const { t } = useI18n()
const route = useRoute()
const subcategorySlug = computed(() => route.params.subcategory)
const subcategory = serverFetch('subcategory-projects', {
  slug: subcategorySlug.value,
}, {}, 'findBySlug')
const category = computed(() => subcategory.value?.category)
const projects = serverFetch('projects', {
  filters: {
    subcategories: { slug: { $in: subcategorySlug.value } },
  },
  sort: [
    { time: { start: 'desc', end: 'desc' } },
    { rank: 'asc' },
  ],
  pagination: { pageSize: 99 },
}, [])
const subcategories = computed(() => category.value?.subcategories?.sort((a, b) => a.rank - b.rank) || [])
const title = computed(() => category.value?.title)

watch(subcategory, async (val) => {
  if (!val?.id) {
    display404()
  }
})

definePageMeta({
  key: route => route.fullPath
})

// В title выносим подкатегорию: иначе все подкатегории одной категории
// получают одинаковый заголовок в выдаче
const metaTitle = computed(() => {
  if (!subcategory.value?.title) return title.value
  if (!category.value?.title) return subcategory.value.title
  return `${subcategory.value.title} — ${category.value.title}`
})

useHead(metaInfo({ title: metaTitle }))

const breadcrumbs = computed(() => {
  if (!subcategory.value?.title || !category.value) return null

  return [
    { name: t('menu.portfolio') || 'Portfolio', url: '/portfolio' },
    { name: category.value.title, url: `/portfolio/${category.value.slug}` },
    { name: subcategory.value.title, url: route.path },
  ]
})

const collectionData = computed(() => subcategory.value?.title ? {
  title: metaTitle.value,
  description: subcategory.value.description || subcategory.value.title,
  items: (projects.value || []).map(project => ({
    title: project.title,
    url: `/portfolio/${category.value?.slug}/${subcategorySlug.value}/${project.slug}`,
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
