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

useHead(metaInfo({ title }))
</script>
