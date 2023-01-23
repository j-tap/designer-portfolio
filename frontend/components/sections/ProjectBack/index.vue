<template>
  <div class="project-back">
    <NuxtLink
      :to="{
        name: 'portfolio-category',
        params: { category: props.categoryName },
        hash: `#project-${props.projectId}`,
      }"
    >
      <IconBase name="arrow-left" size="xl" />
      {{ $t('portfolio.back_to_portfolio') }}
    </NuxtLink>
  </div>
</template>

<script setup>
import { IconBase } from '~/components/common'

const props = defineProps({
  categoryName: String,
  projectId: Number,
})
</script>

<style lang="scss" src="./style.scss" scoped />