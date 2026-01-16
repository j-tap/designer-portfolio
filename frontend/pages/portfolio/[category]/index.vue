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

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
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
</script>
