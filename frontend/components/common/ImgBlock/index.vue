<template>
  <picture :class="classes">
    <BlurHash
      v-if="props.blurhash"
      class="img-block__blurhash"
      :hash="props.blurhash"
      :width="size.width"
      :height="size.height"
    />
    <img
      class="img-block__img"
      :src="src"
      :alt="props.alt"
      :width="size.width"
      :height="size.height"
      loading="lazy"
      @load="onLoadImg"
      @error="onError"
    >
  </picture>
</template>

<script setup>
import { BlurHash } from '~/components/common'
import { getSizeFromProps } from '~/composables/useSizePx'

const props = defineProps({
  src: {
    type: String,
    required: true,
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