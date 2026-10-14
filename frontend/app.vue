<template>
  <div :class="classes">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { isLoading } = useLoadingIndicator()

// Мета-информация нужна каждой странице (заголовки, JSON-LD): запрос делается здесь один раз,
// страницы получают те же данные через useSiteMeta()
useSiteMeta()

// canonical, hreflang, og:url, og:locale и lang у <html> для текущей языковой версии (@nuxtjs/i18n).
// Страницы списка постов (?page=2…) канонизируются сами на себя, чтобы посты со 2+ страницы не терялись
useHead(useLocaleHead({ seo: { canonicalQueries: ['page'] } }))

const classes = computed(() => [
  'app-container',
  { 'app-container_loading': isLoading.value },
])
</script>

<style lang="scss" src="~/assets/style/app.scss" />
