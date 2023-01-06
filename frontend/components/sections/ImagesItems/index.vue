<template>
  <div v-if="props.images.length" class="images-items">
    <p class="images-items__notify">{{ $t('carousel.pull_to_side_to_see_more') }} &rarr;</p>
    <div class="images-items__wrap-list">
      <ScrollBlock>
        <ul class="images-items__list">
          <li
            v-for="img in props.images"
            :key="strToNumHash(img.src)"
            class="images-items__item"
          >
            <img :src="img.src" alt=" ">
          </li>
        </ul>
      </ScrollBlock>
    </div>
  </div>
</template>

<script setup>
import { ScrollBlock } from '~/components/common'

const props = defineProps({
  images: Array,
})
</script>

<style lang="scss" src="./style.scss" scoped />