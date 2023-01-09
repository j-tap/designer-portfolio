<template>
  <dl class="view-item">
    <dt class="view-item__header">
      <h2 class="view-item__title">{{ props.data.title }}</h2>
      <h3 v-if="props.data.subtitle" class="view-item__subtitle">{{ props.data.subtitle }}</h3>
    </dt>
    <dd class="view-item__body">
      <ImagesItems
        :images="props.data.images"
        :images-size="props.imagesSize"
        :display-hint="props.displayHint"
        class="view-item__images-items"
      />
    </dd>
  </dl>
</template>

<script setup>
import { ImagesItems } from '~/components/sections'

const props = defineProps({
  data: Object,
  displayHint: Boolean,
  imagesSize: String,
})
</script>

<style lang="scss" src="./style.scss" scoped />