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
              <a v-if="item.link" :href="item.link" target="_blank">{{ item.company }}</a>
              <span v-else>{{ item.company }}</span>
            </h2>
            <RatingStars v-model="item.rating" />
          </div>
          <div class="review__subheader">
            <time class="review__date" :datetime="item.createdAt" >{{ dateFormat(item.createdAt) }}</time>
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
  <p v-else>Пока нет отзывов, вы можете быть первым</p>
</template>

<script setup>
import { RatingStars, FilesList } from '~/components/common'
import { dateFormat } from '~/utils/formatDate'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="scss" scoped src="./style.scss"/>
