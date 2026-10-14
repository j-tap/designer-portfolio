<template>
  <div class="page-portfolio">
    <ContentWrap>
      <h1 class="page-portfolio__title">{{t('menu.portfolio')}}</h1>
      <PortfolioCategories :items="categories" />
    </ContentWrap>
  </div>
</template>

<script setup>
import { PortfolioCategories } from '~/components/sections'
import { ContentWrap } from '~/components/structure'
import { portfolioPath } from '~/config/portfolio'

const { t } = useI18n()
const { data: categories } = await useRequiredStrapiData('category-projects', { sort: [{ rank: 'asc' }] }, { allowMissing: true })

usePageMeta({ title: () => t('menu.portfolio') })

useStructuredData('collection', {
  collection: computed(() => ({
    title: t('menu.portfolio'),
    description: t('menu.portfolio'),
    items: (categories.value || []).map(category => ({
      title: category.title,
      url: portfolioPath(category.slug),
    })),
  })),
})
</script>

<style lang="scss" scoped src="./style.scss"/>