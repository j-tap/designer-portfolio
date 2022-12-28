<template>
  <div class="page-main">
    <section class="page-main__section-head title-section">
      <ClientOnly>
        <MarqueeBlock class="title-section__row title-section__row_1">
          <TitleOutline tag="span">ui/ux designer&nbsp;</TitleOutline>
        </MarqueeBlock>
      </ClientOnly>
      <h1 class="page-main__title">
        <span class="title-section__row title-section__row_2">
          <TitleOutline tag="div">Портфолио</TitleOutline>
          <span class="title-section__row_2__sub-small">ui/ux designer</span>
        </span>
        <MarqueeBlock class="title-section__row title-section__row_3" reverse>
          <TitleOutline tag="div">Конойко Диана&nbsp;</TitleOutline>
        </MarqueeBlock>
      </h1>
      <h2 class="title-section__row title-section__row_4">
        <span class="title-section__row_4__sub-small">тут я собрала все свои последние клевые проекты</span>
        <TitleOutline class="title-section__row_4__sub-large" tag="div">ui/ux designer</TitleOutline>
      </h2>
    </section>

    <section class="page-main__section-info info-section">
      <h3 class="info-section__title">О моем опыте</h3>
      <p>В сфере дизайна я более 3х лет. За это время мне удалось поработать с разносторонними проектами, как мелкие стартапы, так и масштабные.</p>

      <TitleOutline tag="h3">инструменты</TitleOutline>
      <div>
        <p>Я работаю в программах:</p>
        <ul>
          <li>Figma;</li>
          <li>Adobe пакет;</li>
          <li>Axure;</li>
          <li>Blender;</li>
          <li>И многие другие.</li>
        </ul>
      </div>
      <TitleOutline tag="h3">Навыки</TitleOutline>
      <div>
        <ul>
          <li>Имеются знание и опыт принципов и методологий проектирования сложных систем и интерфейсов, atomic design.</li>
          <li>Опыт работы в качестве UX\UI дизайнера.</li>
          <li>Навык проектирования, прототипирования и реализации интерфейсов взаимодействия с пользователями в вебе и на мобильных устройствах.</li>
          <li>Навык анимации и 3D проектирования.</li>
        </ul>
      </div>

      <TitleOutline tag="h3">тоже важное</TitleOutline>
      <p>Есть базовые знания html/css и большой опыт взаимодействия с разработчиками, что упрощает процесс работы.</p>
    </section>

    <section class="page-main__section-portfolio">
      <PortfolioCategories :items="categories" />
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