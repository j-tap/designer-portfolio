<template>
  <ul :class="['menu', { 'menu_open': props.open }]">
    <li
      class="menu__item"
      v-for="item in items"
      :key="item.name"
    >
      <NuxtLink
        class="menu__link"
        :to="{ name: item.name }"
        @click.native="onClickItem(item)"
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
</script>

<style lang="scss" src="./style.scss" scoped/>