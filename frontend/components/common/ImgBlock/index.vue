<template>
  <div :class="classes">
    <BlurHash
      v-if="props.blurhash"
      class="img-block__blurhash"
      :hash="props.blurhash"
      :width="size.width"
      :height="size.height"
    />
    <picture>
      <!-- loading, sizes и srcset — раньше src: картинку, созданную на клиенте, браузер начинает
        грузить по src и иначе может скачать оригинал -->
      <img
        ref="imgElem"
        class="img-block__img"
        :loading="props.eager ? 'eager' : 'lazy'"
        :fetchpriority="props.eager ? 'high' : undefined"
        decoding="async"
        :sizes="props.srcset ? props.sizes : undefined"
        :srcset="props.srcset || undefined"
        :src="props.src"
        :alt="props.alt"
        :width="size.width"
        :height="size.height"
        :itemprop="itemprop ? 'image' : undefined"
        @load="onLoadImg"
        @error="onError"
      >
    </picture>
    <!-- Ленивая картинка, а не фон: фон браузер скачал бы сразу для всех карточек на странице -->
    <img
      v-if="srcHover"
      class="img-block__img-hover"
      loading="lazy"
      decoding="async"
      :sizes="props.srcsetHover ? props.sizes : undefined"
      :srcset="props.srcsetHover || undefined"
      :src="srcHover"
      alt=""
      aria-hidden="true"
    >
  </div>
</template>

<script setup>
import { BlurHash } from '~/components/common'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  // Уменьшенные копии (useMedia().mediaSrcset) и ширина картинки на странице для выбора из них
  srcset: {
    type: String,
    default: null,
  },
  sizes: {
    type: String,
    default: '100vw',
  },
  srcHover: {
    type: String,
    default: null,
  },
  srcsetHover: {
    type: String,
    default: null,
  },
  blurhash: {
    type: [String, null],
  },
  alt: {
    type: [String, Number],
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  itemprop: {
    type: Boolean,
    default: false,
  },
  // Для первого экрана: грузим сразу и с высоким приоритетом (LCP)
  eager: {
    type: Boolean,
    default: false,
  },
})

const isLoaded = ref(false)
const imgElem = ref(null)

onMounted(() => {
  // Картинка отдаётся в SSR-разметке и может загрузиться до гидрации — события load тогда не будет
  if (imgElem.value?.complete) {
    isLoaded.value = true
  }
})

const classes = computed(() => [
  'img-block',
  { 'img-block_loaded': isLoaded.value }
])
const size = computed(() => ({ width: props.width, height: props.height }))

function onLoadImg () {
  isLoaded.value = true
}

function onError () {
  isLoaded.value = true
}
</script>

<style lang="scss" src="./style.scss" scoped />