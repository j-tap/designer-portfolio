<template>
  <ul class="socials-list">
    <li
      v-for="item in items"
      :key="item.title"
      class="socials-list__item"
    >
      <NuxtLink
        v-if="item.name && safeUrl(item.link)"
        :to="safeUrl(item.link)"
        :aria-label="item.title"
        class="socials-list__link"
        target="_blank"
        external
      >
        <IconBase
          :name="`social-${item.name}`"
          class="socials-list__icon"
          size="lg"
        />
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
import { IconBase } from '~/components/common'
import { safeUrl } from '~/utils/url'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="scss" scoped src="./style.scss"/>
