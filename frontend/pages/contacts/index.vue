<template>
  <div class="page-contacts">
    <h1 class="page-contacts__title page-title">
      <TitleOutline class="page-title__item" tag="span">{{ $t('menu.contacts') }}</TitleOutline>
      <ClientOnly>
        &nbsp;<TitleOutline class="page-title__item" tag="span">{{ $t('menu.contacts') }}</TitleOutline>
      </ClientOnly>
    </h1>
    <ul class="page-contacts__lis contacts-list">
      <li class="contacts-list__item" v-for="item in contacts" :key="item.title">
        <ClientOnly>
          <TitleOutline tag="span">{{ item.title }}</TitleOutline>
        </ClientOnly>
        <NuxtLink
          class="contacts-list__link"
          :to="item.link"
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
import { setMeta } from '~/composables/useMeta'
import { find } from '~/composables/useApi'

const { t } = useI18n()

const { contact: data } = await find('contact')
const contacts = computed(() => data || [])

setMeta({
  title: t('menu.contacts'),
})
</script>

<style lang="scss" scoped src="./style.scss"/>