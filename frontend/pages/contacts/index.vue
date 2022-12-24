<template>
  <div class="page-contacts">
    <h1 class="page-contacts__title page-title">
      <span class="page-title__item">Контакты</span>
      <span class="page-title__item">Контакты</span>
    </h1>
    <ul class="page-contacts__lis contacts-list">
      <li class="contacts-list__item" v-for="item in contacts" :key="item.name">
        <span>{{ item.name }}</span>
        <a class="contacts-list__link" :href="item.link" target="_blank" rel="nofollow">{{ item.name }}</a>
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const contacts = [
  { name: 'telegram', link: '//tg.me' },
  { name: 'behance', link: '//behance.net' },
  { name: 'email', link: 'mailto:test@test.ts' },
]
</script>

<style lang="scss" scoped src="./style.scss"/>