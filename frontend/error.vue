<template>
  <NuxtLayout v-if="is404">
    <Error404 />
  </NuxtLayout>
  <div v-else>
    <ContentWrap class="server-error">
      <div>
        <TitleOutline class="server-error__text" tag="h1">{{ t('error.unknown') }}</TitleOutline>
        <button class="server-error__btn" type="button" @click="clearError({ redirect: '/' })">
          {{ t('error.clear') }}
        </button>
        <div v-if="isDev">
          <p>Code: {{ error.statusCode }}</p>
          <p>URL: {{ error.url }}</p>
          <p>Status: {{ error.statusMessage }}</p>
          <p>{{ error.message }}</p>
          <pre>{{ error.stack }}</pre>
        </div>
      </div>
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { TitleOutline } from '~/components/common'
import { Error404 } from '~/components/sections'

const props = defineProps({
  error: Object,
})

const { t } = useI18n()
const isDev = import.meta.dev

// Страница ошибки рендерится вместо app.vue: язык у <html> ставим здесь. canonical и hreflang
// странице ошибки не нужны — она не индексируется
useHead(useLocaleHead({ seo: false }))
// 404 — та же страница, что и для неизвестного адреса ([...slug].vue), остальные ошибки — общий экран
const is404 = computed(() => props.error?.statusCode === 404)

// Страница 404 задаёт мета-теги сама (Error404); здесь — только для остальных ошибок,
// без запросов к Strapi: он может быть причиной ошибки
if (!is404.value) {
  useSeoMeta({
    title: () => t('error.unknown'),
    robots: 'noindex, nofollow',
  })
}
</script>

<style lang="scss">
.server-error {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  & &__text {
    display: block;
    font-size: max(24px, 5vw);
    text-align: center;
    text-transform: uppercase;
  }
  &__btn {
    display: block;
    width: 280px;
    height: 45px;
    cursor: pointer;
    margin: 2vw auto 0;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 1.5px;
    color: $color__white;
    background: transparent;
    border: 1px solid;
  }
}
</style>
