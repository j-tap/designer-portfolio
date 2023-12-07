<template>
  <div
    :class="['project-colors', `color-sort-${curSortFunction}`]"
    @click="toggleSorting"
  >
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
import {
  colorDistance,
  hexToRgb,
  rgbToHue,
  rgbToLightness,
  rgbToLuminance,
  rgbToSaturation,
} from '~/composables/useColors'

const sortFunctions = [
  rgbToLightness,
  rgbToLuminance,
  rgbToHue,
  rgbToSaturation,
  colorDistance,
]
const curSortFunction = ref(0)

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const colorsList = computed(() => {
  return props.items.sort((a, b) => {
    const func = sortFunctions[curSortFunction.value]
    const v1 = func(hexToRgb(a.color))
    const v2 = func(hexToRgb(b.color))

    return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0)
  })
})

function toggleSorting () {
  const max = sortFunctions.length
  let val = curSortFunction.value + 1

  if (val >= max || val < 0) {
    val = 0
  }

  curSortFunction.value = val
}
</script>

<style lang="scss" src="./style.scss" scoped />