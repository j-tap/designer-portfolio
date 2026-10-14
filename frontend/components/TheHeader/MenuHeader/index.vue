<template>
  <ul :class="['menu', { 'menu_open': props.open }]">
    <li
      class="menu__item"
      v-for="item in items"
      :key="item.path"
    >
      <NuxtLink
        :class="['menu__link', { 'menu__link_active': isActive(item) }]"
        :to="localePath(item.path)"
        @click="onClickItem(item)"
      >
        <TitleOutline class="menu__link-text_sm">{{ t(item.locale) }}</TitleOutline>
        <span class="menu__link-text_md-up">{{ t(item.locale) }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
import { TitleOutline } from '~/components/common'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  open: Boolean,
})
const emit = defineEmits(['click-item'])

function onClickItem (item) {
  emit('click-item', item)
}

// Раздел активен на своей странице и на вложенных (портфолио → категория → проект), главная — только на себе
function isActive (item) {
  const path = localePath(item.path)
  return route.path === path || (item.path !== '/' && route.path.startsWith(`${path}/`))
}
</script>

<style lang="scss" src="./style.scss" scoped/>