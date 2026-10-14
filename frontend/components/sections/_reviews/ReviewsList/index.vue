<template>
  <ul v-if="items?.length" class="reviews-list">
    <li
      v-for="item in items"
      :key="item.id"
      class="reviews-list__item"
    >
      <article class="review">
        <header class="review__header">
          <div class="review__subheader">
            <h2 class="review__title">
              <a v-if="safeUrl(item.link)" :href="safeUrl(item.link)" target="_blank" rel="noopener noreferrer nofollow">{{ item.company }}</a>
              <span v-else>{{ item.company }}</span>
            </h2>
            <RatingStars :model-value="item.rating" />
          </div>
          <div class="review__subheader">
            <time class="review__date" :datetime="item.createdAt">{{ d(item.createdAt, 'date') }}</time>
            <div v-if="item.cooperations" class="review__cooperations">
              {{ item.cooperations.map(o => o.title).join(',' + '&nbsp;'.repeat(5)) }}
            </div>
            <span class="review__name">{{ item.name }}</span>
          </div>
        </header>
        <div v-if="item.developments" class="review__developments">
          {{ item.developments.map(o => o.title).join(',' + '&nbsp;'.repeat(5)) }}
        </div>
        <p class="review__text">{{ item.text }}</p>
        <FilesList :items="item.files" />
      </article>
    </li>
  </ul>
  <p v-else>{{ t('reviews.empty') }}</p>
</template>

<script setup>
import { RatingStars, FilesList } from '~/components/common'
import { safeUrl } from '~/utils/url'

const { t, d } = useI18n()

defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="scss" scoped src="./style.scss"/>
