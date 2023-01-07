<template>
  <div class="page-main">
    <section class="page-main__section-head title-section">
      <ClientOnly>
        <MarqueeBlock class="title-section__row title-section__row_1">
          <TitleOutline tag="span">ui/ux designer</TitleOutline>&nbsp;
        </MarqueeBlock>
      </ClientOnly>
      <h1 class="page-main__title">
        <div class="title-section__row title-section__row_2 row-title-2">
          <MarqueeBlock class="row-title-2__sub-large_sm" reverse>
            <TitleOutline tag="div">Портфолио</TitleOutline>&nbsp;
          </MarqueeBlock>
          <TitleOutline class="row-title-2__sub-large_md-up" tag="div">Портфолио</TitleOutline>
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
        <span class="title-section__row_4__sub-small">тут я собрала все свои последние клевые проекты</span>
        <TitleOutline class="title-section__row_4__sub-large" tag="div">ui/ux designer</TitleOutline>
      </h2>
    </section>

    <section class="page-main__section-info info-section">
      <h3 class="info-section__title">О моем опыте</h3>
      <p class="info-section__description">В сфере дизайна я более 3х лет. За это время мне удалось поработать с разносторонними проектами, как мелкие стартапы, так и масштабные.</p>

      <div class="info-section__details info-details">
        <div class="info-details__one">
          <TitleOutline class="info-details__title" tag="h3">инструменты</TitleOutline>
          <div class="info-details__list-column html-text">
            <ul>
              <li>Figma;</li>
              <li>Adobe пакет;</li>
              <li>Axure;</li>
              <li>Blender;</li>
              <li>И многие другие.</li>
            </ul>
          </div>
        </div>
        <div class="info-details__two">
          <TitleOutline class="info-details__title" tag="h3">Навыки</TitleOutline>
          <div class="html-text">
            <ul>
              <li>Имеются знание и опыт принципов и методологий проектирования сложных систем и интерфейсов, atomic design.</li>
              <li>Опыт работы в качестве UX\UI дизайнера.</li>
              <li>Навык проектирования, прототипирования и реализации интерфейсов взаимодействия с пользователями в вебе и на мобильных устройствах.</li>
              <li>Навык анимации и 3D проектирования.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="info-important">
        <TitleOutline
          class="info-important__title"
          tag="h3"
          inverse
        >
          тоже важное
        </TitleOutline>
        <div class="info-important__text">
          Есть базовые знания html/css и большой опыт взаимодействия с разработчиками, что упрощает процесс работы.
        </div>
      </div>

      <PortfolioCategories class="info-section__portfolio" :items="categories" />
    </section>
  </div>
</template>

<script setup>
import { TitleOutline, MarqueeBlock } from '~/components/common'
import { PortfolioCategories } from '~/components/sections'
import categories from '~/mocks/categories'

definePageMeta({
  title: 'Портфолио',
  description: 'Портфолио ui/ux дизайнера',
})
</script>

<style lang="scss" scoped src="./style.scss"/>