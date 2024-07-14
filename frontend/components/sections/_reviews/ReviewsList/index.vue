<template>
  <ul v-if="items?.length" class="reviews-list">
    <li
      v-for="item in items"
      :key="item.id"
      class="reviews-list__item review"
    >
      <header>
        <h2 class="review__name">{{ item.name }}</h2>
        <time class="review__date" :datetime="item.createdAt" >{{ item.createdAt }}</time>
        <div class="review__company">{{ item.company }}</div>
        <a class="review__link" :href="item.link" target="_blank">{{ item.link }}</a>
        <div class="review__rating">{{ item.rating }}</div>
      </header>
      <article class="review__content">
        <div class="review__development">{{ item.development?.title }}</div>
        <div class="review__cooperation">{{ item.cooperation?.title }}</div>
        <p class="review__text">{{ item.text }}</p>
        <div class="review__files">{{ item.files }}</div>
      </article>
      <pre>{{ item }}</pre>
    </li>
  </ul>
  <p v-else>Пока нет отзывов, вы можете быть первым</p>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="scss" scoped src="./style.scss"/>
