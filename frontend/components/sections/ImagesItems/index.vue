<template>
  <div :class="classes">
    <p
      v-if="isDisplayHint"
      class="images-items__notify"
    >
      {{ t('carousel.pull_to_side_to_see_more') }} &rarr;
    </p>
    <div class="images-items__wrap-list">
      <ScrollBlock>
        <ul v-if="images?.length" ref="list" class="images-items__list">
          <li
            v-for="item in images"
            :key="item.id"
            class="images-items__item"
          >
            <ScrollBlock>
              <img
                loading="lazy"
                decoding="async"
                :sizes="sizes"
                :srcset="mediaSrcset(item)"
                :src="mediaUrl(item.url)"
                :width="item.width"
                :height="item.height"
                alt=" "
              >
            </ScrollBlock>
          </li>
        </ul>
      </ScrollBlock>
    </div>
  </div>
</template>

<script setup>
import { useEventListener } from '@vueuse/core'
import { ScrollBlock } from '~/components/common'

const { t } = useI18n()
const { mediaUrl, mediaSrcset } = useMedia()

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

const classes = computed(() => ['images-items', `images-items_size-${props.imagesSize}`])

// Ширина карточки из style.scss: small — clamp(320px, 19vw, 360px), large — clamp(320px, 42vw, 810px)
const SIZES = {
  small: '360px',
  large: '(max-width: 762px) 320px, (min-width: 1929px) 810px, 42vw',
}
const sizes = computed(() => SIZES[props.imagesSize] || '100vw')

// Подсказка «потяните в сторону» — только когда картинки не помещаются в окно
const listEl = useTemplateRef('list')
const isOverflowing = ref(false)
const isDisplayHint = computed(() => props.displayHint && isOverflowing.value)

function measure () {
  const width = [...(listEl.value?.children || [])].reduce((sum, child) => sum + child.offsetWidth, 0)
  isOverflowing.value = width > window.innerWidth
}

onMounted(measure)
useEventListener('resize', measure, { passive: true })
</script>

<style lang="scss" src="./style.scss" scoped />