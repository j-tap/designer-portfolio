<template>
  <div class="project-colors">
    <ScrollBlock>
      <ul class="project-colors__list">
        <li
          v-for="item in props.items"
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
</script>

<style lang="scss" src="./style.scss" scoped />