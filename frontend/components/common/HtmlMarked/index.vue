<template>
  <div class="html-marked" v-html="markdownToHtml" />
</template>

<script setup>
import { Marked } from 'marked'
import { safeUrl, escapeHtml } from '~/utils/url'

const props = defineProps({
  text: String,
})

// marked не санитизирует вывод: сырой HTML выводим текстом, а ссылки и картинки
// с опасной схемой (javascript: и т.п.) обезвреживаем, иначе это XSS из контента Strapi
const marked = new Marked({
  walkTokens (token) {
    if (token.type === 'link' || token.type === 'image') {
      token.href = safeUrl(token.href) ?? '#'
    }
  },
  renderer: {
    html ({ text }) {
      return escapeHtml(text)
    },
  },
})

const markdownToHtml = computed(() => marked.parse(props.text || ''))
</script>

<style lang="scss" src="./style.scss" scoped />