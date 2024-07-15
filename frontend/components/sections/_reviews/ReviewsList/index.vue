<template>
  <ul v-if="items?.length" class="reviews-list">
    <li
      v-for="item in items"
      :key="item.id"
      class="reviews-list__item review"
    >
      <header class="review__header">
        <time class="review__date" :datetime="item.createdAt" >{{ dateFormat(item.createdAt) }}</time>
        <RatingStars class="review__rating" v-model="item.rating" />
        <a class="review__link" :href="item.link" target="_blank">{{ item.link }}</a>
      </header>
      <article class="review__content">
        <div class="review__development">{{ item.development?.title }}</div>
        <div class="review__cooperation">{{ item.cooperation?.title }}</div>
        <blockquote class="review__text">
          <p>{{ item.text }}</p>
          <footer>
            —<span class="review__name">{{ item.name }}</span>,
            <cite class="review__company">{{ item.company }}</cite>
          </footer>
        </blockquote>
        <div class="file-list review__files">
          <div
            v-for="file in item.files"
            :key="file.id"
            class="file-list__item"
          >
            <img
              v-if="isImage(file.mime)"
              :src="urlFile(file.url)"
              :alt="file.name"
            />
            <p>{{ file.name }}</p>
            <a class="btn btn_xs" :href="file.url" download>Download</a>
          </div>
        </div>
      </article>
    </li>
  </ul>
  <p v-else>Пока нет отзывов, вы можете быть первым</p>
</template>

<script setup>
import { RatingStars } from '~/components/common'
import { dateFormat } from '~/utils/formatDate'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

function isImage (mime) {
  return !mime.startsWith('image/')
}
</script>

<style lang="scss" scoped src="./style.scss"/>
