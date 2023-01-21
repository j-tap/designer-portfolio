<template>
  <canvas
    ref="canvas"
    :width="size.width"
    :height="size.height"
    class="blurhash-preview"
  />
</template>

<script setup>
import { nextTick } from 'vue'
import { decode } from 'blurhash'
import { getSizeFromProps } from '~/composables/useSizePx'

const props = defineProps({
  hash: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
})
const canvas = ref(null)
const size = computed(() => {
  const k = 10
  const width = Math.ceil(props.width / k)
  const height = Math.ceil(props.height / k)
  return getSizeFromProps({ width, height })
})

onMounted(() => {
  draw()
})

watch(
  () => props.hash || size.value,
  () => draw()
)

async function draw () {
  await nextTick()

  const ctx = canvas.value.getContext('2d')
  const k = 10
  const { width: w, height: h } = size.value

  if (w > 0 && h > 0) {
    const pixels = decode(props.hash, w, h, -1)
    const imageData = ctx.createImageData(w, h)
    imageData.data.set(pixels)
    ctx.scale(k, k)
    ctx.putImageData(imageData, 0, 0)
  }
}
</script>

<style lang="scss" src="./style.scss" scoped />