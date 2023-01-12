<template>
  <div class="html-marked" v-html="markdownToHtml" />
</template>

<script setup>
import { marked } from 'marked'

const props = defineProps({
  text: String,
})

const markdownToHtml = computed(() => marked.parse(props.text))
</script>

<style lang="scss" src="./style.scss" scoped />