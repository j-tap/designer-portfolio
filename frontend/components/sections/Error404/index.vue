<template>
  <ContentWrap class="error-404">
    <TitleOutline class="error-404__text" tag="h1">404</TitleOutline>
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { TitleOutline } from '~/components/common'
import { metaInfo } from '~/composables/useMeta'

const { t } = useI18n()

useHead(metaInfo({
  title: '404',
  description: t('common.error_{code}', { code: 404 }),
}))
</script>

<style lang="scss" src="./style.scss" scoped />