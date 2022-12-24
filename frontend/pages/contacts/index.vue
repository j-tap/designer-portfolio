<template>
  <div>
    <h1>Contacts</h1>
    <ul>
      <li v-for="item in contacts" :key="item.name">
        <a :href="item.link" target="_blank" rel="nofollow">{{ item.name }}</a>
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