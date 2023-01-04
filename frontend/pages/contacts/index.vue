<template>
  <div class="page-contacts">
    <h1 class="page-contacts__title page-title">
      <TitleOutline class="page-title__item" tag="span">Контакты</TitleOutline>
      <ClientOnly>
        &nbsp;<TitleOutline class="page-title__item" tag="span">Контакты</TitleOutline>
      </ClientOnly>
    </h1>
    <ul class="page-contacts__lis contacts-list">
      <li class="contacts-list__item" v-for="item in contacts" :key="item.name">
        <ClientOnly>
          <TitleOutline tag="span">{{ item.name }}</TitleOutline>
        </ClientOnly>
        <NuxtLink
          class="contacts-list__link"
          :to="item.link"
          target="_blank"
          external
        >
          {{ item.name }}
        </NuxtLink>
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
  { name: 'telegram', link: 'https://t.me/DianaKonoyko' },
  { name: 'behance', link: 'https://www.behance.net/diana_konoyko' },
  { name: 'email', link: 'mailto:dianakonoyko@gmail.com' },
]
</script>

<style lang="scss" scoped src="./style.scss"/>