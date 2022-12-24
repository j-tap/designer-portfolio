<template>
  <div>
    <h1>Portfolio</h1>
    <ul>
      <li v-for="item in categories" :key="item.name">
        <NuxtLink :to="{ name: 'portfolio-category', params: { category: item.name } }">
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import categories from '~/mocks/categories.js'
</script>