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
} from '~/utils/colors'

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

// Сортируем копию: props — данные страницы, их порядок менять нельзя
const colorsList = computed(() => {
  const sortValue = sortFunctions[curSortFunction.value]
  return props.items
    .map(item => ({ ...item, value: sortValue(hexToRgb(item.color)) }))
    .toSorted((a, b) => a.value - b.value)
})

// Клик по палитре переключает способ сортировки по кругу
function toggleSorting () {
  curSortFunction.value = (curSortFunction.value + 1) % sortFunctions.length
}
</script>

<style lang="scss" src="./style.scss" scoped />