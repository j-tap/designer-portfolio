<template>
  <section :class="['landing-cards', { 'landing-cards_numbered': section.numbered }]">
    <h2 class="landing-cards__title">{{ section.title }}</h2>
    <HtmlMarked v-if="section.text" class="landing-cards__text" :text="section.text" />

    <Component :is="section.numbered ? 'ol' : 'ul'" class="landing-cards__list">
      <li
        v-for="(item, index) in section.items"
        :key="item.id ?? index"
        class="landing-cards__item"
      >
        <TitleOutline v-if="section.numbered" class="landing-cards__number" aria-hidden="true">
          {{ String(index + 1).padStart(2, '0') }}
        </TitleOutline>
        <h3 class="landing-cards__item-title">{{ item.title }}</h3>
        <HtmlMarked v-if="item.text" class="landing-cards__item-text" :text="item.text" />
      </li>
    </Component>
  </section>
</template>

<script setup>
import { HtmlMarked, TitleOutline } from '~/components/common'

// Раздел с карточками: услуги, преимущества; numbered — этапы работы с номерами
defineProps({
  section: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" src="./style.scss" scoped />
