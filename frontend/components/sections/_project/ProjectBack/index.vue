<template>
  <BackLink
    :to="{
      name: 'portfolio-category',
      params: { category: props.categoryName },
      hash: `#project-${props.projectId}`,
    }"
    class="project-back"
  >
    {{ $t('portfolio.back_to_portfolio') }}
  </BackLink>
</template>

<script setup>
import { BackLink } from '~/components/common'

const props = defineProps({
  categoryName: String,
  projectId: Number,
})
</script>

<style lang="scss" src="./style.scss" scoped />