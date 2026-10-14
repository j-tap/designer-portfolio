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

const { mediaUrl } = useMedia()

definePageMeta({ layout: 'blank' })

const { t } = useI18n()
const title = computed(() => t('donate.title'))
const description = computed(() => t('donate.description'))

const { data } = useStrapiData('donate-options', { sort: [{ order: 'asc' }] })
const options = computed(() => (data.value || []).map(item => ({
  ...item,
  icon: item.icon ? { ...item.icon, url: mediaUrl(item.icon.url) } : null,
  qr: item.qr ? { ...item.qr, url: mediaUrl(item.qr.url) } : null,
  requisites: (item.requisites || []).filter(requisite => requisite?.value),
})))

usePageMeta({ title, description, noindex: true })
</script>

<style lang="scss" scoped src="./style.scss"/>
