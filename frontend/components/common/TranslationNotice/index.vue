<template>
  <p
    v-if="locale && locale !== pageLocale"
    class="translation-notice"
    role="note"
    :lang="pageLocale"
  >
    {{ t('content.not_translated') }}
  </p>
</template>

<script setup>
// Запись Strapi без перевода показывается на языке оригинала (useStrapiData): предупреждаем,
// чтобы текст на другом языке не выглядел ошибкой
defineProps({
  // Язык показанной версии записи (её поле locale)
  locale: {
    type: String,
    default: null,
  },
})

const { t, locale: pageLocale } = useI18n()
</script>

<style lang="scss" src="./style.scss" scoped />
