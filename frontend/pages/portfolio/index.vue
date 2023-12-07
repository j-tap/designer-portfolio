<template>
  <div class="page-portfolio">
    <ContentWrap>
      <h1 class="page-portfolio__title">Portfolio</h1>
      <PortfolioCategories :items="categories" />
    </ContentWrap>
  </div>
</template>

<script setup>
import { PortfolioCategories } from '~/components/sections'
import { ContentWrap } from '~/components/structure'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch } from '~/composables/useApi'

const { t } = useI18n()
const categories = serverFetch('category-projects', {
  sort: [{ rank: 'asc' }],
}, [])

useHead(metaInfo({
  title: ref(t('menu.portfolio')),
}))
</script>

<style lang="scss" scoped src="./style.scss"/>