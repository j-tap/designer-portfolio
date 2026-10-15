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
const { locales: pageLocales, contentLocale, paths: pagePaths } = usePageLocales()
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const absoluteUrl = useAbsoluteUrl()

// - Другие языковые версии (hreflang, og:locale:alternate) — только те, что у страницы есть:
//   у записи Strapi может не быть перевода.
// - Страница без перевода показывает оригинал (useStrapiData) — это копия страницы на языке
//   оригинала: canonical и og:url ведут на неё, чтобы поисковики не считали копию переводом.
// - У версий посадочной страницы свои адреса (slug на каждом языке): hreflang ведёт на них
useHead(computed(() => {
  const exists = code => pageLocales.value.includes(code)
  const original = contentLocale.value !== locale.value
    && absoluteUrl(pagePaths.value[contentLocale.value] ?? switchLocalePath(contentLocale.value))
  const { link = [], meta = [], ...head } = localeHead.value
  const hreflangLocale = hreflang => (hreflang === 'x-default' ? defaultLocale : hreflang.split('-')[0])

  return {
    ...head,
    link: link
      .filter(({ hreflang }) => !hreflang || exists(hreflangLocale(hreflang)))
      .map((item) => {
        if (original && item.rel === 'canonical') return { ...item, href: original }
        const own = item.hreflang && pagePaths.value[hreflangLocale(item.hreflang)]
        return own ? { ...item, href: absoluteUrl(own) } : item
      }),
    meta: meta
      .filter(({ property, content }) => property !== 'og:locale:alternate'
        || exists(content.split('_')[0]))
      .map(item => (original && item.property === 'og:url' ? { ...item, content: original } : item)),
  }
}))

const classes = computed(() => [
  'app-container',
  { 'app-container_loading': isLoading.value },
])
</script>

<style lang="scss" src="~/assets/style/app.scss" />
