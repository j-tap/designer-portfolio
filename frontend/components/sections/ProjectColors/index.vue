<template>
  <div class="project-colors">
    <ul class="project-colors__list">
      <li
        v-for="color in props.items"
        :key="strToNumHash(color)"
        class="project-colors__item"
      >
        <div class="project-colors__item-color" :style="`background-color: ${color}`"/>
        <div class="project-colors__item-title">{{ color }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  items: Array,
})
</script>

<style lang="scss" src="./style.scss" scoped />