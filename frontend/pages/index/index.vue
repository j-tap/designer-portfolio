<template>
  <div class="page-main">
    <section class="page-main__section-head">
      <ClientOnly>
        <MarqueeBlock>
          <TitleOutline tag="span">ui/ux designer</TitleOutline>
        </MarqueeBlock>
      </ClientOnly>
      <h1 class="page-main__title">
        <span class="page-main__title-sub">
          <TitleOutline tag="div">Портфолио</TitleOutline>
          <span>ui/ux designer</span>
        </span>
        <MarqueeBlock reverse>
          <TitleOutline tag="div">Конойко Диана</TitleOutline>
        </MarqueeBlock>
      </h1>
      <h2 class="page-main__title-two">
        <span>тут я собрала все свои последние клевые проекты</span>
        <TitleOutline class="page-main__title-two-sub" tag="div">ui/ux designer</TitleOutline>
      </h2>
    </section>
    <section class="page-main__section-info">
      <h3>О моем опыте</h3>
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