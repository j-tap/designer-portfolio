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
import categories from '~/mocks/categories'
</script>

<style lang="scss" scoped src="./style.scss"/>