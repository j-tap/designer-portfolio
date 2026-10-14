<template>
  <!-- 404 (например, из middleware/portfolio.js) — та же страница, что и для неизвестного адреса -->
  <NuxtLayout v-if="is404">
    <Error404 />
  </NuxtLayout>
  <div v-else>
    <ContentWrap class="server-error">
      <div>
        <TitleOutline class="server-error__text" tag="h1">Sorry, unknown error</TitleOutline>
        <button class="server-error__btn" @click="handleError">Clear errors</button>
        <div v-if="isDev">
          <p>Code: {{ error.statusCode }}</p>
          <p>URL: {{ error.url }}</p>
          <p>Status: {{ error.statusMessage }}</p>
          <p>{{ error.message }}</p>
          <pre v-html="error.stack" />
        </div>
      </div>
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { TitleOutline } from '~/components/common'
import { Error404 } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'

const props = defineProps({
  error: Object
})

const is404 = computed(() => props.error?.statusCode === 404)
const handleError = () => clearError({ redirect: '/' })
const runtimeConfig = useRuntimeConfig()
const isDev = computed(() => runtimeConfig.public.NODE_ENV !== 'production')

if (!is404.value) {
  useHead(metaInfo({
    title: 'Error. Sorry, unknown error',
  }))
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
