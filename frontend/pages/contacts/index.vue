<template>
  <div class="page-contacts">
    <TitlePage class="page-contacts__title">{{ title }}</TitlePage>

    <ul class="page-contacts__list contacts-list">
      <li
        v-for="item in contacts"
        :key="item.id"
        class="contacts-list__item"
      >
        <TitleOutline tag="span">{{ item.title }}</TitleOutline>
        <NuxtLink
          :to="item.link"
          class="contacts-list__link"
          target="_blank"
          external
        >
          {{ item.title }}
        </NuxtLink>
        <TitleOutline tag="span">{{ item.title }}</TitleOutline>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { TitleOutline, TitlePage } from '~/components/common'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch } from '~/composables/useApi'

const { t } = useI18n()
const title = ref(t('menu.contacts'))
const contactsData = serverFetch('contact', {}, [])
const contacts = computed(() => contactsData.value?.contact?.filter(filterLink) || [])

function filterLink(link) {
  return link.display?.includes('contacts')
}

useHead(metaInfo({ title }))
</script>

<style lang="scss" scoped src="./style.scss"/>