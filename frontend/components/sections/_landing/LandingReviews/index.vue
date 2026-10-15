<template>
  <section v-if="reviews.length" class="landing-reviews">
    <h2 class="landing-reviews__title">{{ section.title }}</h2>
    <HtmlMarked v-if="section.text" class="landing-reviews__text" :text="section.text" />

    <ReviewsList class="landing-reviews__list" :items="reviews" />

    <NuxtLink class="btn landing-reviews__all" :to="localePath('/reviews')">
      {{ section.link_label || t('landing.all_reviews') }}
    </NuxtLink>
  </section>
</template>

<script setup>
import { HtmlMarked } from '~/components/common'
import ReviewsList from '../../_reviews/ReviewsList'

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
