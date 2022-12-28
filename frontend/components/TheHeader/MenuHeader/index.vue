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
        {{ $t(item.locale) }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
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