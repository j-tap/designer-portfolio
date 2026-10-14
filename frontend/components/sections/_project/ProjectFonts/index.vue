<template>
  <div class="project-fonts" v-if="props.items.length">
    <h2 class="project-fonts__title">{{ t('project.fonts') }}</h2>
    <ul class="project-fonts__list">
      <li
        v-for="item in props.items"
        :key="item.id"
        class="project-fonts__item"
      >
        <span :style="{ fontFamily: `'${fontName(item)}'` }">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { mediaUrl } = useMedia()
const { t } = useI18n()
const props = defineProps({
  items: { type: Array, default: () => [] },
})

// Название шрифта из Strapi — в кавычках CSS, поэтому кавычки и обратные слэши из него убираем
const fontName = item => String(item.title).replace(/['"\\]/g, '')

// Каждый шрифт проекта подключается своим @font-face, чтобы название в списке было написано им самим.
// Формат браузер определяет по файлу сам
useHead({
  style: () => props.items
    .filter(item => item.file?.url)
    .map(item => ({
      key: `font-${item.id}`,
      innerHTML: `@font-face { font-family: '${fontName(item)}'; src: url('${mediaUrl(item.file.url)}'); }`,
    })),
})
</script>

<style lang="scss" src="./style.scss" scoped />