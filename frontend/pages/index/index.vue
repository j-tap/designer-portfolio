<template>
  <div class="page-main">
    <section class="page-main__section-head title-section">
      <MarqueeBlock class="title-section__row title-section__row_1">
        <TitleOutline tag="span">{{ meta.specialization }}</TitleOutline>&nbsp;
      </MarqueeBlock>
      <h1 class="page-main__title" itemscope itemtype="https://schema.org/Person">
        <span class="title-section__row title-section__row_2 row-title-2">
          <MarqueeBlock class="row-title-2__sub-large_sm" reverse>
            <TitleOutline tag="div">{{ t('menu.portfolio') }}</TitleOutline>&nbsp;
          </MarqueeBlock>
          <TitleOutline class="row-title-2__sub-large_md-up" tag="div">{{ t('menu.portfolio') }}</TitleOutline>
          <span class="row-title-2__sub-small" itemprop="jobTitle">{{ meta.specialization }}</span>
        </span>
        <span class="title-section__row title-section__row_3 row-title-3">
          <MarqueeBlock class="row-title-3__marquee" reverse>
            <TitleOutline tag="div" itemprop="name">
              {{ meta.firstName }} {{ meta.lastName }}&nbsp;
            </TitleOutline>
          </MarqueeBlock>
          <TitleOutline class="row-title-3__static" tag="div">
            {{ meta.lastName }}
            <div class="row-title-3__static-small">{{ meta.firstName }}</div>
          </TitleOutline>
        </span>
      </h1>
      <h2 class="title-section__row title-section__row_4">
        <span class="title-section__row_4__sub-small">{{ withYears(home?.small_description) }}</span>
        <TitleOutline class="title-section__row_4__sub-large" tag="div">{{ meta.specialization }}</TitleOutline>
      </h2>
    </section>

    <section class="page-main__section-info info-section" :lang="contentLang(home)">
      <TranslationNotice :locale="home?.locale" />
      <h3 class="info-section__title">
        {{ withYears(home?.experience?.title) }}
      </h3>
      <HtmlMarked :text="withYears(home?.experience?.text)" class="info-section__description" />

      <div class="info-section__details info-details">
        <div class="info-details__one">
          <h3 class="info-details__title">
            {{ home?.tools?.title }}
          </h3>
          <HtmlMarked :text="home?.tools?.text" class="info-details__list-column" />
        </div>
        <div class="info-details__two">
          <h3 class="info-details__title">{{ home?.skills?.title }}</h3>
          <HtmlMarked :text="home?.skills?.text" />
        </div>
      </div>

      <div class="info-important">
        <h3 class="info-important__title">
          {{ home?.important?.title }}
        </h3>
        <HtmlMarked :text="home?.important?.text" class="info-important__text" />
      </div>

      <div class="info-section__portfolio">
        <h3 class="info-section__title info-section__title_small">{{ t('menu.portfolio') }}</h3>
        <PortfolioCategories :items="categories" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { TitleOutline, MarqueeBlock, HtmlMarked, TranslationNotice } from '~/components/common'
import { PortfolioCategories } from '~/components/sections'
import { fillExperience } from '~/utils/experience'

const { t } = useI18n()
const meta = useSiteMeta()
const contentLang = useContentLang()
const withYears = text => fillExperience(text, meta.value.careerStartYear)

const { data: home } = await useRequiredStrapiData('home', {}, { singleType: true, allowMissing: true })
definePageLocales(home)
const { data: categories } = useStrapiData('category-projects', { sort: [{ rank: 'asc' }] })
const contacts = useContacts()

usePageMeta()

useStructuredData('home', {
  includeOrganization: true,
  // sameAs связывает страницу с профилями автора — помогает поисковикам склеить сущность
  sameAs: computed(() => contacts.value.map(item => item.link).filter(link => link?.startsWith('http'))),
})
</script>

<style lang="scss" scoped src="./style.scss"/>