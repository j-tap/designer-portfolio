<template>
  <div class="page-main">
    <section v-if="home" class="page-main__section-head title-section">
      <ClientOnly>
        <MarqueeBlock class="title-section__row title-section__row_1">
          <TitleOutline tag="span">ui/ux designer</TitleOutline>&nbsp;
        </MarqueeBlock>
      </ClientOnly>
      <h1 class="page-main__title">
        <div class="title-section__row title-section__row_2 row-title-2">
          <MarqueeBlock class="row-title-2__sub-large_sm" reverse>
            <TitleOutline tag="div">{{ $t('menu.portfolio') }}</TitleOutline>&nbsp;
          </MarqueeBlock>
          <TitleOutline class="row-title-2__sub-large_md-up" tag="div">{{ $t('menu.portfolio') }}</TitleOutline>
          <div class="row-title-2__sub-small">ui/ux designer</div>
        </div>
        <div class="title-section__row title-section__row_3 row-title-3">
          <MarqueeBlock class="row-title-3__marquee" reverse>
            <TitleOutline tag="div">Конойко Диана&nbsp;</TitleOutline>
          </MarqueeBlock>
          <TitleOutline class="row-title-3__static" tag="div">
            Конойко
            <div class="row-title-3__static-small">Диана</div>
          </TitleOutline>
        </div>
      </h1>
      <h2 class="title-section__row title-section__row_4">
        <div class="title-section__row_4__sub-small" v-html="home.small_description" />
        <TitleOutline class="title-section__row_4__sub-large" tag="div">ui/ux designer</TitleOutline>
      </h2>
    </section>

    <section v-if="home" class="page-main__section-info info-section">
      <h3 class="info-section__title">
        {{ home.experience?.title }}
      </h3>
      <HtmlMarked :text="home.experience?.text" class="info-section__description" />

      <div class="info-section__details info-details">
        <div class="info-details__one">
          <TitleOutline class="info-details__title" tag="h3">
            {{ home.tools?.title }}
          </TitleOutline>
          <HtmlMarked :text="home.tools?.text" class="info-details__list-column" />
        </div>
        <div class="info-details__two">
          <TitleOutline class="info-details__title" tag="h3">{{ home.skills?.title }}</TitleOutline>
          <HtmlMarked :text="home.skills?.text" />
        </div>
      </div>

      <div class="info-important">
        <TitleOutline
          class="info-important__title"
          tag="h3"
          inverse
        >
          {{ home.important?.title }}
        </TitleOutline>
        <HtmlMarked :text="home.important?.text" class="info-important__text" />
      </div>

      <PortfolioCategories class="info-section__portfolio" :items="categories" />
    </section>
  </div>
</template>

<script setup>
import { TitleOutline, MarqueeBlock, HtmlMarked } from '~/components/common'
import { PortfolioCategories } from '~/components/sections'
import { find } from '~/composables/useApi';
import {metaInfo} from "~/composables/useMeta";

const { data: dataHome } = await find('home')
const { data: dataCategories } = await find('category-projects')

const categories = computed(() => dataCategories || [])
const home = computed(() => dataHome)

useHead(metaInfo())
</script>

<style lang="scss" scoped src="./style.scss"/>