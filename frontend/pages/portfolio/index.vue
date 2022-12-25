<template>
  <div class="page-portfolio">
    <h1 class="page-portfolio__title">Portfolio</h1>
    <PortfolioCategories :items="categories" />
  </div>
</template>

<script setup>
import { PortfolioCategories } from '~/components/sections'
import categories from '~/mocks/categories'
</script>

<style lang="scss" scoped src="./style.scss"/>