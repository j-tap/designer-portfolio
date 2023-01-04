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
import { useCommonStore } from '~/stores/commonStore'

const commonStore = useCommonStore()
const menuMain = [
  { name: 'index', locale: 'menu.main' },
  { name: 'portfolio', locale: 'menu.portfolio' },
  { name: 'contacts', locale: 'menu.contacts' },
]
const openMenu = ref(false);

watch(openMenu, (val) => {
  commonStore.setDisplayMobileMenu(val)
})

function closeMenu () {
  openMenu.value = false
}
</script>

<style lang="scss" src="./style.scss" scoped/>