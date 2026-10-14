<template>
  <div class="page-category">
    <ContentWrap>
      <PortfolioCategory
        :projects="projects"
        :category-slug="categorySlug"
        :title="category.title"
        :back="{ to: '/portfolio', title: t('portfolio.back_to_portfolio') }"
      />
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { PortfolioCategory } from '~/components/sections'

// Категорию с подкатегориями middleware сразу перенаправляет на первую из них
definePageMeta({ middleware: 'portfolio-subcategory' })

const { t } = useI18n()
const route = useRoute()
const categorySlug = route.params.category

const { data: category } = await useRequiredStrapiData('category-projects', {
  filters: { slug: { $eq: categorySlug } },
}, { single: true })

const { data: projects } = await useProjectsList({
  categories: { slug: { $eq: categorySlug } },
}, { default: () => [] })

usePortfolioListPage({
  title: () => category.value.title,
  description: () => category.value.description,
  category,
  projects,
})
</script>
