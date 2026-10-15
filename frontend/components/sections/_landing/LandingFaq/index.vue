<template>
  <section class="landing-faq">
    <h2 class="landing-faq__title">{{ section.title }}</h2>

    <!-- Ответы свёрнуты, но остаются в разметке — их читают поисковики -->
    <div class="landing-faq__list">
      <details
        v-for="(item, index) in section.items"
        :key="item.id ?? index"
        class="landing-faq__item"
      >
        <summary class="landing-faq__question">
          <h3 class="landing-faq__question-text">{{ item.question }}</h3>
          <IconBase class="landing-faq__arrow" name="chevron-down" />
        </summary>
        <HtmlMarked class="landing-faq__answer" :text="item.answer" />
      </details>
    </div>
  </section>
</template>

<script setup>
import { HtmlMarked, IconBase } from '~/components/common'

defineProps({
  section: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" src="./style.scss" scoped />
