<template>
  <div class="page-portfolio">
    <h1 class="page-portfolio__title">Portfolio</h1>
    <ul class="portfolio-categories">
      <li class="portfolio-categories__item" v-for="item in categories" :key="item.name">
        <h2 class="portfolio-categories__title">
          <NuxtLink :to="{ name: 'portfolio-category', params: { category: item.name } }">
            {{ item.title }}
          </NuxtLink>
        </h2>
      </li>
    </ul>
  </div>
</template>

<script setup>
import categories from '~/mocks/categories.js'
</script>

<style lang="scss" scoped src="./style.scss"/>