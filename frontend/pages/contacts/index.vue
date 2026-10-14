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
          :to="safeUrl(item.link)"
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
import { safeUrl } from '~/utils/url'

const { t } = useI18n()
const title = computed(() => t('menu.contacts'))
const contacts = useContacts('contacts')

usePageMeta({ title })
</script>

<style lang="scss" scoped src="./style.scss"/>