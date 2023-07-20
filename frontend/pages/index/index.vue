<template>
  <div class="page-main">
    <section v-if="home" class="page-main__section-head title-section">
      <ClientOnly>
        <MarqueeBlock class="title-section__row title-section__row_1">
          <TitleOutline tag="span">{{ meta.specialization }}</TitleOutline>&nbsp;
        </MarqueeBlock>
      </ClientOnly>
      <h1 class="page-main__title">
        <span class="title-section__row title-section__row_2 row-title-2">
          <MarqueeBlock class="row-title-2__sub-large_sm" reverse>
            <TitleOutline tag="div">{{ $t('menu.portfolio') }}</TitleOutline>&nbsp;
          </MarqueeBlock>
          <TitleOutline class="row-title-2__sub-large_md-up" tag="div">{{ $t('menu.portfolio') }}</TitleOutline>
          <span class="row-title-2__sub-small">{{ meta.specialization }}</span>
        </span>
        <span class="title-section__row title-section__row_3 row-title-3">
          <MarqueeBlock class="row-title-3__marquee" reverse>
            <TitleOutline tag="div">{{ meta.first_name }} {{ meta.last_name }}&nbsp;</TitleOutline>
          </MarqueeBlock>
          <TitleOutline class="row-title-3__static" tag="div">
            {{ meta.last_name }}
            <div class="row-title-3__static-small">{{ meta.first_name }}</div>
          </TitleOutline>
        </span>
      </h1>
      <h2 class="title-section__row title-section__row_4">
        <span class="title-section__row_4__sub-small" v-html="home.small_description" />
        <TitleOutline class="title-section__row_4__sub-large" tag="div">{{ meta.specialization }}</TitleOutline>
      </h2>
    </section>

    <section v-if="home" class="page-main__section-info info-section">
      <h3 class="info-section__title">
        {{ home.experience?.title }}
      </h3>
      <HtmlMarked :text="home.experience?.text" class="info-section__description" />

      <div class="info-section__details info-details">
        <div class="info-details__one">
          <h3 class="info-details__title">
            {{ home.tools?.title }}
          </h3>
          <HtmlMarked :text="home.tools?.text" class="info-details__list-column" />
        </div>
        <div class="info-details__two">
          <h3 class="info-details__title">{{ home.skills?.title }}</h3>
          <HtmlMarked :text="home.skills?.text" />
        </div>
      </div>

      <div class="info-important">
        <h3 class="info-important__title">
          {{ home.important?.title }}
        </h3>
        <HtmlMarked :text="home.important?.text" class="info-important__text" />
      </div>

      <div class="info-section__portfolio">
        <h3 class="info-section__title info-section__title_small">{{ $t('menu.portfolio') }}</h3>
        <PortfolioCategories :items="categories" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { TitleOutline, MarqueeBlock, HtmlMarked } from '~/components/common'
import { PortfolioCategories } from '~/components/sections'
import { find } from '~/composables/useApi'
import { metaInfo } from '~/composables/useMeta'
import { useMetaStore } from '~/stores/metaStore'

const metaStore = useMetaStore()
const meta = computed(() => metaStore.getMetaInfo)
const { data: dataHome } = await find('home')
const { data: dataCategories } = await find('category-projects', {
  sort: [{ rank: 'asc' }],
})


const categories = computed(() => dataCategories || [])
const home = computed(() => dataHome)

useHead(metaInfo())
</script>

<style lang="scss" scoped src="./style.scss"/>