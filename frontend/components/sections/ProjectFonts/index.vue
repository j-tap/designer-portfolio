<template>
  <div class="project-fonts">
    <h2 class="project-fonts__title">{{ $t('project.fonts') }}</h2>
    <ul class="project-fonts__list">
      <li
        v-for="item in props.items"
        :key="strToNumHash(item.id)"
        class="project-fonts__item"
      >
        <TitleOutline>{{ item.title }}</TitleOutline>
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