<template>
  <div class="project-fonts">
    <h2 class="project-fonts__title">{{ $t('project.fonts') }}</h2>
    <ul class="project-fonts__list">
      <li
          v-for="font in props.items"
          :key="strToNumHash(font)"
          class="project-fonts__item"
      >
        <TitleOutline>{{ font }}</TitleOutline>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'

const props = defineProps({
  items: Array,
})
</script>

<style lang="scss" src="./style.scss" scoped />