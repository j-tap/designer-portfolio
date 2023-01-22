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
import { find } from '~/composables/useApi'

const { t } = useI18n()

const { data } = await find('category-projects')
const categories = computed(() => data || [])

useHead(metaInfo({
  title: t('menu.portfolio'),
}))
</script>

<style lang="scss" scoped src="./style.scss"/>