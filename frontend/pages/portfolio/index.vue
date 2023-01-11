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
import { setMeta } from '~/composables/useMeta'
import categories from '~/mocks/categories'

const { t } = useI18n()

setMeta({
  title: t('menu.portfolio'),
})
</script>

<style lang="scss" scoped src="./style.scss"/>