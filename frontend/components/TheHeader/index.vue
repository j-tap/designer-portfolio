<template>
  <header class="header">
    <nav class="header__nav nav">
      <ul class="nav__list">
        <li class="nav__item" v-for="item in menu" ::key="item.name">
          <NuxtLink class="nav__link" :to="{ name: item.name }">{{ $t(item.locale) }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
const menu = [
  { name: 'index', locale: 'menu.main' },
  { name: 'portfolio', locale: 'menu.portfolio' },
  { name: 'contacts', locale: 'menu.contacts' },
]
</script>

<style lang="scss" src="./style.scss" scoped/>