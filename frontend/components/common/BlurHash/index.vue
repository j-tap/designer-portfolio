<template>
  <canvas
    ref="canvas"
    :width="size.width"
    :height="size.height"
    class="blurhash-preview"
  />
</template>

<script setup>
import { decode } from 'blurhash'

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
// Хеш раскодируется в картинку в 10 раз меньше оригинала: размытому превью детали не нужны,
// а растягивает его CSS
const SCALE = 10

const canvasEl = useTemplateRef('canvas')
const size = computed(() => ({
  width: Math.ceil(props.width / SCALE),
  height: Math.ceil(props.height / SCALE),
}))

function draw () {
  const { width, height } = size.value
  if (!canvasEl.value || width <= 0 || height <= 0) return

  const ctx = canvasEl.value.getContext('2d')
  const imageData = ctx.createImageData(width, height)
  imageData.data.set(decode(props.hash, width, height, -1))
  ctx.putImageData(imageData, 0, 0)
}

onMounted(draw)
watch([() => props.hash, size], draw, { flush: 'post' })
</script>

<style lang="scss" src="./style.scss" scoped />