<template>
  <div class="page-donate">
    <ContentWrap>
      <TitlePage class="page-donate__title">{{ title }}</TitlePage>
      <p v-if="description" class="page-donate__description">{{ description }}</p>
      <DonateList :items="options" class="page-donate__list" />
    </ContentWrap>
  </div>
</template>

<script setup>
import { TitlePage } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { DonateList } from '~/components/sections'
import { getDonateData, getDonateOptions } from '~/composables/useDonate'
import { metaInfo } from '~/composables/useMeta'
import { urlFile } from '~/composables/useApi'

definePageMeta({ layout: 'blank' })

const { t } = useI18n()
const donateData = getDonateData()
const donateOptionsData = getDonateOptions()
const title = computed(() => donateData.value?.title || t('donate.title'))
const description = computed(() => donateData.value?.description)
const options = computed(() => (donateOptionsData.value || []).map(item => ({
  ...item,
  icon: item.icon ? { ...item.icon, url: urlFile(item.icon.url) } : null,
})))

useHead(metaInfo({
  title,
  description,
}))
</script>

<style lang="scss" scoped src="./style.scss"/>
