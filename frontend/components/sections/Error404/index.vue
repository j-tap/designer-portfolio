<template>
  <ContentWrap class="error-404">
    <TitleOutline class="error-404__text" tag="h1">404</TitleOutline>
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { TitleOutline } from '~/components/common'

const { t } = useI18n()

usePageMeta({
  title: '404',
  description: () => t('common.error_{code}', { code: 404 }),
  noindex: true,
})
</script>

<style lang="scss" src="./style.scss" scoped />