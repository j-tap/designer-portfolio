<template>
  <div :class="classes">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { defaultLocale } from '~/config/i18n'

const { isLoading } = useLoadingIndicator()

// Мета-информация нужна каждой странице (заголовки, JSON-LD): запрос делается здесь один раз,
// страницы получают те же данные через useSiteMeta()
useSiteMeta()

// canonical, hreflang, og:url, og:locale и lang у <html> для текущей языковой версии (@nuxtjs/i18n).
// Страницы списка постов (?page=2…) канонизируются сами на себя, чтобы посты со 2+ страницы не терялись
const localeHead = useLocaleHead({ seo: { canonicalQueries: ['page'] } })
const { locales: pageLocales } = usePageLocales()

// Другие языковые версии (hreflang, og:locale:alternate) — только те, что у страницы есть:
// у записи Strapi может не быть перевода, и ссылка вела бы на 404
useHead(computed(() => {
  const exists = code => pageLocales.value.includes(code)
  const { link = [], meta = [], ...head } = localeHead.value

  return {
    ...head,
    link: link.filter(({ hreflang }) => !hreflang
      || exists(hreflang === 'x-default' ? defaultLocale : hreflang.split('-')[0])),
    meta: meta.filter(({ property, content }) => property !== 'og:locale:alternate'
      || exists(content.split('_')[0])),
  }
}))

const classes = computed(() => [
  'app-container',
  { 'app-container_loading': isLoading.value },
])
</script>

<style lang="scss" src="~/assets/style/app.scss" />
