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
      <source
        v-if="srcLite"
        :srcset="srcLite"
        media="(max-width:1023px)"
      >
      <img
        class="img-block__img"
        :src="src"
        :alt="props.alt"
        :width="size.width"
        :height="size.height"
        :itemprop="itemprop ? 'image' : undefined"
        loading="lazy"
        @load="onLoadImg"
        @error="onError"
      >
    </picture>
    <div
      v-if="srcHover"
      :style="`background-image: url(${srcHover})`"
      class="img-block__img-hover"
    />
  </div>
</template>

<script setup>
import { BlurHash } from '~/components/common'
import { getSizeFromProps } from '~/composables/useSizePx'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  srcLite: {
    type: String,
    default: null,
  },
  srcHover: {
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
})

const isLoaded = ref(false)
const src = ref(null)

onMounted(() => {
  src.value = props.src
})

const classes = computed(() => [
  'img-block',
  { 'img-block_loaded': isLoaded.value }
])
const size = computed(() => getSizeFromProps(props))

function onLoadImg () {
  isLoaded.value = true
}

function onError () {
  isLoaded.value = true
}
</script>

<style lang="scss" src="./style.scss" scoped />