<template>
  <h1 :class="['title-page', { 'title-page_decor': decor }]">
    <ClientOnly>
      <TitleOutline class="title-page__item" tag="span">
        <slot/>&nbsp;
      </TitleOutline>
    </ClientOnly>
    <TitleOutline class="title-page__item" tag="span">
      <slot/>
    </TitleOutline>
    <ClientOnly>
      <TitleOutline class="title-page__item" tag="span">
        &nbsp;<slot/>
      </TitleOutline>
    </ClientOnly>
  </h1>
</template>

<script setup>
import { TitleOutline } from '~/components/common'

const props = defineProps({
  decor: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped src="./style.scss"/>
