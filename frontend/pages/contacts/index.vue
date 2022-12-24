<template>
  <div class="page-contacts">
    <h1 class="page-contacts__title page-title">
      <TitleOutline class="page-title__item" tag="span">Контакты</TitleOutline>
      <ClientOnly>
        <TitleOutline class="page-title__item" tag="span">Контакты</TitleOutline>
      </ClientOnly>
    </h1>
    <ul class="page-contacts__lis contacts-list">
      <li class="contacts-list__item" v-for="item in contacts" :key="item.name">
        <ClientOnly>
          <TitleOutline tag="span">{{ item.name }}</TitleOutline>
        </ClientOnly>
        <a class="contacts-list__link" :href="item.link" target="_blank" rel="nofollow">{{ item.name }}</a>
        <ClientOnly>
          <TitleOutline tag="span">{{ item.name }}</TitleOutline>
        </ClientOnly>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'

const contacts = [
  { name: 'telegram', link: '//tg.me' },
  { name: 'behance', link: '//behance.net' },
  { name: 'email', link: 'mailto:test@test.ts' },
]
</script>

<style lang="scss" scoped src="./style.scss"/>