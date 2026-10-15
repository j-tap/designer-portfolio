<template>
  <section class="landing-hero">
    <div class="landing-hero__inner">
      <h1 class="landing-hero__title">
        <span v-if="titleParts.accent" class="landing-hero__title-accent">{{ titleParts.accent }}</span>
        {{ ' ' }}
        <TitleOutline v-if="titleParts.rest" class="landing-hero__title-rest">{{ titleParts.rest }}</TitleOutline>
      </h1>
      <!-- Пометка о непереведённой странице -->
      <slot />

      <p v-if="hero?.lead" class="landing-hero__lead">{{ hero.lead }}</p>
      <HtmlMarked v-if="hero?.text" class="landing-hero__text" :text="hero.text" />

      <div v-if="hasActions" class="landing-hero__actions">
        <a v-if="contactHref && hero.cta_label" class="btn landing-hero__cta" :href="contactHref">
          {{ hero.cta_label }}
        </a>
        <a v-if="projectsHref && hero.projects_label" class="landing-hero__link" :href="projectsHref">
          {{ hero.projects_label }}
        </a>
      </div>

      <p v-if="hero?.note" class="landing-hero__note">{{ hero.note }}</p>
    </div>

    <!-- Бегущая строка — украшение: тот же текст уже есть на странице -->
    <MarqueeBlock v-if="hero?.marquee" class="landing-hero__marquee" aria-hidden="true">
      <TitleOutline>{{ hero.marquee }}&nbsp;</TitleOutline>
    </MarqueeBlock>
  </section>
</template>

<script setup>
import { HtmlMarked, MarqueeBlock, TitleOutline } from '~/components/common'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  // Начало заголовка, выделенное сплошным цветом; остальное — контуром
  titleAccent: {
    type: String,
    default: null,
  },
  hero: {
    type: Object,
    default: null,
  },
  // Якоря разделов страницы, к которым ведут кнопки; нет раздела — нет и кнопки
  contactHref: {
    type: String,
    default: null,
  },
  projectsHref: {
    type: String,
    default: null,
  },
})

const titleParts = computed(() => {
  const accent = props.titleAccent?.trim()
  if (!accent || !props.title.startsWith(accent)) return { accent: props.title, rest: null }
  return { accent, rest: props.title.slice(accent.length).trim() || null }
})

const hasActions = computed(() => (props.contactHref && props.hero?.cta_label)
  || (props.projectsHref && props.hero?.projects_label))
</script>

<style lang="scss" src="./style.scss" scoped />
