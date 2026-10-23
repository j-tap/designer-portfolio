<template>
  <section class="landing-cases">
    <h2 class="landing-cases__title">{{ section.title }}</h2>
    <HtmlMarked v-if="section.text" class="landing-cases__text" :text="section.text" />

    <ul class="landing-cases__list">
      <li
        v-for="(item, index) in items"
        :key="item.id ?? index"
        class="landing-cases__item landing-case"
      >
        <!-- Ссылка с картинки дублирует ссылку под текстом: для клавиатуры и чтецов она одна -->
        <Component
          :is="item.to ? NuxtLink : 'div'"
          :to="item.to || undefined"
          class="landing-case__media"
          :tabindex="item.to ? -1 : undefined"
          aria-hidden="true"
        >
          <ImgBlock
            v-if="item.image"
            class="landing-case__img"
            :src="item.image.src"
            :srcset="item.image.srcset"
            sizes="(max-width: 1023px) 100vw, 33vw"
            :blurhash="item.image.blurhash"
            :width="item.image.width"
            :height="item.image.height"
            alt=""
          />
          <TitleOutline v-else class="landing-case__placeholder">{{ item.title }}</TitleOutline>
        </Component>

        <h3 class="landing-case__title">
          {{ item.title }}
          <span v-if="item.subtitle" class="landing-case__subtitle">{{ item.subtitle }}</span>
        </h3>
        <HtmlMarked v-if="item.text" class="landing-case__text" :text="item.text" />
        <NuxtLink v-if="item.to" class="landing-case__link" :to="item.to">
          {{ item.link_label || item.title }}
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { NuxtLink } from '#components'
import { HtmlMarked, ImgBlock, TitleOutline } from '~/components/common'

defineProps({
  section: {
    type: Object,
    required: true,
  },
  // Проекты раздела с обложкой (image: src, srcset, размеры) и адресом страницы (to), если проект нашёлся в Strapi
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss" src="./style.scss" scoped />
