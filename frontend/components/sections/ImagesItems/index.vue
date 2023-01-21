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
        <ul v-if="props.images.length" class="images-items__list">
          <li
            v-for="item in props.images"
            :key="strToNumHash(item.src)"
            class="images-items__item"
          >
            <ScrollBlock>
              <img :src="item.src" alt=" ">
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