<template>
  <ContentWrap>
    <TitleOutline class="text-404" tag="h1">404</TitleOutline>
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { TitleOutline } from '~/components/common'
import { setMeta } from  '~/composables/useMeta'

const { t } = useI18n()

setMeta({
  title: '404',
  description: t('common.error_{code}', { code: 404 }),
})
</script>

<style lang="scss" src="./style.scss" scoped />