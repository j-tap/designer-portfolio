<template>
  <section v-if="reviews.length" class="landing-reviews">
    <h2 class="landing-reviews__title">{{ section.title }}</h2>
    <HtmlMarked v-if="section.text" class="landing-reviews__text" :text="section.text" />

    <ul class="landing-reviews__list">
      <li v-for="item in reviews" :key="item.id" class="landing-review">
        <blockquote class="landing-review__text">«{{ item.text }}»</blockquote>
        <p class="landing-review__author">
          <span class="landing-review__name">{{ item.name }}</span>
          <template v-if="item.company">
            , <a v-if="safeUrl(item.link)" :href="safeUrl(item.link)" target="_blank" rel="noopener noreferrer nofollow">{{ item.company }}</a>
            <template v-else>{{ item.company }}</template>
          </template>
        </p>
      </li>
    </ul>

    <NuxtLink class="btn landing-reviews__all" :to="localePath('/reviews')">
      {{ section.link_label || t('landing.all_reviews') }}
    </NuxtLink>
  </section>
</template>

<script setup>
import { HtmlMarked } from '~/components/common'
import { safeUrl } from '~/utils/url'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const { t } = useI18n()
const localePath = useLocalePath()

// Последние отзывы: Strapi отдаёт только опубликованные (backend/src/api/review).
// Отзыв не локализован, поэтому остаётся на языке автора
const { data } = useStrapiData('reviews', {
  sort: [{ createdAt: 'desc' }],
  pagination: { pageSize: props.section.limit || 3 },
}, { default: () => [] })

const reviews = computed(() => data.value ?? [])
</script>

<style lang="scss" src="./style.scss" scoped />
