<template>
  <div class="page-donate">
    <ContentWrap>
      <TitleOutline class="page-donate__title">{{ title }}</TitleOutline>
      <p v-if="description" class="page-donate__description">{{ description }}</p>
      <DonateList :items="options" class="page-donate__list" />
    </ContentWrap>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { DonateList } from '~/components/sections'
import { getDonateOptions } from '~/composables/useDonate'
import { metaInfo } from '~/composables/useMeta'
import { urlFile } from '~/composables/useApi'

definePageMeta({ layout: 'blank' })

const { t } = useI18n()
const donateOptionsData = getDonateOptions()
const title = computed(() => t('donate.title'))
const description = computed(() => t('donate.description'))
const options = computed(() => (donateOptionsData.value || []).map(item => ({
  ...item,
  icon: item.icon ? { ...item.icon, url: urlFile(item.icon.url) } : null,
})))

useHead(metaInfo({
  title,
  description,
  noindex: true,
}))
</script>

<style lang="scss" scoped src="./style.scss"/>
