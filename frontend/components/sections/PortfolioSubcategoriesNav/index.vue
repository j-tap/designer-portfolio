<template>
  <nav class="portfolio-subcategories-nav">
    <ul class="portfolio-subcategories-nav__list">
      <li
        v-for="item in items"
        :key="item.slug"
        class="portfolio-subcategories-nav__item"
      >
        <NuxtLink
          :class="[
            'portfolio-subcategories-nav__link',
            {
              'portfolio-subcategories-nav__link_active': active?.slug === item.slug,
            },
          ]"
          :to="{
            name: 'portfolio-category-subcategory',
            params: {
              category: item.category.slug,
              subcategory: item.slug,
            },
          }"
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  active: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style lang="scss" scoped src="./style.scss"/>
