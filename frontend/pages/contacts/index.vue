<template>
  <div class="page-contacts">
    <h1 class="page-contacts__title page-title">
      <TitleOutline class="page-title__item" tag="span">{{ t('menu.contacts') }}</TitleOutline>
      <ClientOnly>
        &nbsp;<TitleOutline class="page-title__item" tag="span">{{ t('menu.contacts') }}</TitleOutline>
      </ClientOnly>
    </h1>
    <ul class="page-contacts__lis contacts-list">
      <li
        v-for="item in contacts"
        :key="item.title"
        class="contacts-list__item"
      >
        <ClientOnly>
          <TitleOutline tag="span">{{ item.title }}</TitleOutline>
        </ClientOnly>
        <NuxtLink
          :to="item.link"
          class="contacts-list__link"
          target="_blank"
          external
        >
          {{ item.title }}
        </NuxtLink>
        <ClientOnly>
          <TitleOutline tag="span">{{ item.title }}</TitleOutline>
        </ClientOnly>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { metaInfo } from '~/composables/useMeta'
import { serverFetch } from '~/composables/useApi'

const { t } = useI18n()
const contactsData = serverFetch('contact', {}, [])
const contacts = computed(() => contactsData.value?.contact)

useHead(metaInfo({
  title: ref(t('menu.contacts')),
}))
</script>

<style lang="scss" scoped src="./style.scss"/>