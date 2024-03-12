<template>
  <div class="page-card">
    <TitlePage class="page-card__title" decor>{{ title }}</TitlePage>
    <h2 class="page-card__subtitle">{{ meta.specialization }} <b>{{ meta.first_name }} {{ meta.last_name }}</b></h2>

    <div class="page-card__socials card-socials">
      <SocialsList
        :items="links"
        class="card-socials__list"
      />
    </div>
  </div>
</template>

<script setup>
import { TitlePage } from '~/components/common'
import { SocialsList } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch } from '~/composables/useApi'
import { useMetaStore } from '~/stores/metaStore'

const { t } = useI18n()
const metaStore = useMetaStore()
const title = ref(t('app.card'))
const meta = computed(() => metaStore.getMetaInfo)
const contactsData = serverFetch('contact', {}, [])
const links = computed(() => contactsData.value?.contact?.filter(filterLink).map(mapLink))

function filterLink(link) {
  return link.display?.includes('card')
}

function mapLink (link) {
  return {
    ...link,
    name: stringToKey(link.title),
  }
}

useHead(metaInfo({ title }))
</script>

<style lang="scss" scoped src="./style.scss"/>
