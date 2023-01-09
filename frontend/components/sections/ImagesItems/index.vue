<template>
  <div :class="classes">
    <p
      v-if="displayHint"
      class="images-items__notify"
    >
      {{ $t('carousel.pull_to_side_to_see_more') }} &rarr;
    </p>
    <div class="images-items__wrap-list">
      <ScrollBlock>
        <ul class="images-items__list">
          <li
            v-for="img in props.images"
            :key="strToNumHash(img.src)"
            class="images-items__item"
          >
            <ScrollBlock>
              <img :src="img.src" alt=" ">
            </ScrollBlock>
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
  imagesSize: {
    type: String,
    validator: v => ['small', 'large'].includes(v),
  },
  displayHint: {
    type: Boolean,
    default: false,
  },
})

const classes = computed(() => {
  const cls = 'images-items'
  return [cls, `${cls}_size-${props.imagesSize}`]
})
</script>

<style lang="scss" src="./style.scss" scoped />