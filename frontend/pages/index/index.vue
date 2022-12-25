<template>
  <div class="page-main">
    <ClientOnly>
      <TitleOutline tag="span">ui/ux designer</TitleOutline>
    </ClientOnly>
    <h1 class="page-main__title">
      <TitleOutline tag="div">Портфолио</TitleOutline>
      <div>ui/ux designer</div>
      <TitleOutline tag="div">Конойко Диана</TitleOutline>
    </h1>

    <h2>тут я собрала все свои последние клевые проекты</h2>
    <ClientOnly>
      <TitleOutline tag="div">ui/ux designer</TitleOutline>
    </ClientOnly>
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

    <PortfolioCategories :items="categories"/>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { PortfolioCategories } from '~/components/sections'
import categories from '~/mocks/categories'

definePageMeta({
  title: 'Портфолио',
  description: 'Портфолио ui/ux дизайнера',
})
</script>

<style lang="scss" scoped src="./style.scss"/>