<template>
  <ul class="portfolio-categories">
    <li
      v-for="item in props.items"
      :key="item.slug"
      class="portfolio-categories__item"
    >
      <NuxtLink
        class="portfolio-categories__title"
        :to="{ name: 'portfolio-category', params: { category: item.slug } }"
      >
        <TitleOutline
          class="portfolio-categories__title-text"
          tag="span"
          :data-hover="item.title"
        >
          {{ item.title }}
        </TitleOutline>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
import { TitleOutline } from '~/components/common'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped src="./style.scss"/>