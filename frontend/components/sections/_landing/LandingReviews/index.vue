<template>
  <section v-if="reviews.length" class="landing-reviews">
    <h2 class="landing-reviews__title">{{ section.title }}</h2>
    <HtmlMarked v-if="section.text" class="landing-reviews__text" :text="section.text" />

    <ul class="landing-reviews__list">
      <li v-for="item in reviews" :key="item.id" class="landing-review">
        <p v-if="item.quote" class="landing-review__quote">{{ item.quote }}</p>
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
import { landingReviews } from '~/config/landing'
import { safeUrl } from '~/utils/url'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Опубликованные отзывы от новых к старым (backend/src/api/review). Отзыв без перевода
// остаётся на языке автора
const { data } = useStrapiData('reviews', {
  sort: [{ createdAt: 'desc' }],
}, { default: () => [] })

// Сначала отзывы из config/landing.js — в их порядке, с цитатой и названием компании для посадочной
const reviews = computed(() => {
  const list = data.value ?? []
  const picked = landingReviews
    .map(({ site, quote, company }) => {
      const review = list.find(item => item.link?.includes(site))
      return review && { ...review, quote: quote?.[locale.value], company: company?.[locale.value] || review.company }
    })
    .filter(Boolean)
  const rest = list.filter(item => !picked.some(review => review.id === item.id))
  return [...picked, ...rest].slice(0, props.section.limit || 3)
})
</script>

<style lang="scss" src="./style.scss" scoped />
