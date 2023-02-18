<template>
  <div class="project-colors">
    <ScrollBlock>
      <ul class="project-colors__list">
        <li
          v-for="item in colorsList"
          :key="item.id"
          class="project-colors__item"
        >
          <div class="project-colors__item-color" :style="`background-color: ${item.color}`"/>
          <div class="project-colors__item-title">{{ item.color }}</div>
        </li>
      </ul>
    </ScrollBlock>
  </div>
</template>

<script setup>
import { ScrollBlock } from '~/components/common'

const props = defineProps({
  items: Array,
})

const colorsList = computed(() => {
  return props.items.sort((a, b) => {
    const v1 = rgbToLuminance(hexToRgbArr(a.color))
    const v2 = rgbToLuminance(hexToRgbArr(b.color))

    return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0)
  })
})

function rgbToLuminance (rgb) {
  return Math.sqrt(.299 * rgb[0] * rgb[0] + .587 * rgb[1] * rgb[1] + .114 * rgb[2] * rgb[2])
}

function hexToRgbArr (color = null) {
  if (color) {
    let s = color.toString()
    s = s.replace('#', '')

    if (s.length !== 6) {
      s = s.split('').map(t =>  t + t).join('')
    }

    const hexArr = s.match(/.{1,2}/g)

    return [
      parseInt(hexArr[0], 16),
      parseInt(hexArr[1], 16),
      parseInt(hexArr[2], 16),
    ]
  }

  return null
}
</script>

<style lang="scss" src="./style.scss" scoped />