<template>
  <div class="page-portfolio">
    <h1 class="page-portfolio__title">Portfolio</h1>
    <ul class="portfolio-categories">
      <li class="portfolio-categories__item" v-for="item in categories" :key="item.name">
        <NuxtLink class="portfolio-categories__title" :to="{ name: 'portfolio-category', params: { category: item.name } }">
          <TitleOutline tag="h2" :data-hover="item.title">
            {{ item.title }}
          </TitleOutline>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import categories from '~/mocks/categories.js'
</script>

<style lang="scss" scoped src="./style.scss"/>