<template>
  <BackLink
    :to="{ path: listPath, hash: `#project-${projectId}` }"
    class="project-back"
  >
    {{ t('portfolio.back_to_portfolio') }}
  </BackLink>
</template>

<script setup>
import { BackLink } from '~/components/common'

const { t } = useI18n()

// Назад — в список (категории или подкатегории), к карточке этого проекта
defineProps({
  listPath: {
    type: String,
    required: true,
  },
  projectId: {
    type: Number,
    required: true,
  },
})
</script>

<style lang="scss" src="./style.scss" scoped />