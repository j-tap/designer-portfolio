<template>
  <div class="project-fonts" v-if="props.items.length">
    <h2 class="project-fonts__title">{{ $t('project.fonts') }}</h2>
    <ul class="project-fonts__list">
      <li
        v-for="item in props.items"
        :key="strToNumHash(item.id)"
        class="project-fonts__item"
      >
        <TitleOutline :style="{ fontFamily: item.title }">{{ item.title }}</TitleOutline>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'

const config = useRuntimeConfig()
const props = defineProps({
  items: Array,
})

const fontStyles = ref([])
props.items.map(o => {
  const name = o.title
  const url = `${config.public.strapi.url}${o.file.url}`
  fontStyles.value = {
    id: `style-${name}`,
    type: 'text/css',
    children: `@font-face { font-family: ${name}; src: url(${url}) format('woff'); }`,
  }
})

useHead({
  style: fontStyles,
})
</script>

<style lang="scss" src="./style.scss" scoped />