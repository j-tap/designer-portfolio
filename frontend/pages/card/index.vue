<template>
  <div class="page-card">
    <TitlePage class="page-card__title" decor>{{ title }}</TitlePage>
    <h2 class="page-card__subtitle">
      <small>{{ meta.specialization }}</small>
      <b>{{ meta.firstName }} {{ meta.lastName }}</b>
    </h2>

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
import { stringToKey } from '~/utils/formatData'

const { t } = useI18n()
const title = computed(() => t('app.card'))
const meta = useSiteMeta()
const contacts = useContacts('card')
// name — имя иконки соцсети
const links = computed(() => contacts.value.map(link => ({ ...link, name: stringToKey(link.title) })))

// Визитка — служебная страница, дублирует контакты: из индекса убираем
usePageMeta({ title, noindex: true })
</script>

<style lang="scss" scoped src="./style.scss"/>
