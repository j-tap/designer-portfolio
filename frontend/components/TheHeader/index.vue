<template>
  <header class="header">
    <nav class="header__nav">
      <BurgerBtn
        class="header__burger"
        v-model="openMenu"
      />
      <MenuHeader
        class="header__menu"
        :items="menuMain"
        :open="openMenu"
        @click-item="closeMenu"
      />
    </nav>
  </header>
</template>

<script setup>
import MenuHeader from './MenuHeader'
import { BurgerBtn } from '~/components/common'

const menuMain = [
  { path: '/', locale: 'menu.main' },
  { path: '/portfolio', locale: 'menu.portfolio' },
  { path: '/posts', locale: 'menu.posts' },
  { path: '/reviews', locale: 'menu.reviews' },
  { path: '/contacts', locale: 'menu.contacts' },
]
const openMenu = useMobileMenu()

function closeMenu () {
  openMenu.value = false
}
</script>

<style lang="scss" src="./style.scss" scoped/>