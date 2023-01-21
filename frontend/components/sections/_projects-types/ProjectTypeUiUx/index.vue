<template>
  <div class="project-uiux">
    <ul v-if="pagesDefault.length" class="project-uiux__pages uiux-pages">
      <li
        v-for="page in pagesDefault"
        :key="strToNumHash(page.title)"
        class="uiux-pages__item uiux-page"
      >
        <h2 class="uiux-page__title">{{ page.title }}</h2>
        <h3 v-if="page.subtitle" class="uiux-page__subtitle">{{ page.subtitle }}</h3>
        <ul v-if="page.images.length" class="uiux-page__images">
          <li
            v-for="img in page.images"
            :key="img.id"
            class="uiux-page__images-item"
          >
            <ImgBlock
              class="uiux-page__images-img"
              :src="urlFile(img.formats.large.url)"
              :blurhash="img.blurhash"
              :width="img.width"
              :height="img.height"
              :alt="page.subtitle"
            />
          </li>
        </ul>
      </li>
    </ul>

    <ProjectFonts
      :items="props.data.fonts"
      class="project-uiux__fonts"
    />
    <ProjectColors
      :items="props.data.colors"
      class="project-uiux__colors"
    />
    <ProjectViewsItem
      :data="viewOther"
      images-size="large"
      class="project-uiux__other-pages"
    />
    <ProjectViewsItem
      :data="viewAdaptive"
      images-size="small"
      class="project-uiux__mobile-pages"
    />
  </div>
</template>

<script setup>
import { ImgBlock } from '~/components/common'
import { ProjectViewsItem, ProjectColors, ProjectFonts } from '~/components/sections'
import { pageTypes, getPagesByType } from '~/composables/useProject'

const { t } = useI18n()
const props = defineProps({
  data: Object,
})

const pagesDefault = computed(() => getPagesByType(props.data.pages, pageTypes.default))
const pagesOther = computed(() => getPagesByType(props.data.pages, pageTypes.other))
const pagesMobile = computed(() => getPagesByType(props.data.pages, pageTypes.mobile))
const viewOther = computed(() => ({
  title: t('project.other_pages'),
  subtitle: t('project.other_pages_subtitle'),
  images: pagesOther.value.map(o => o.images).flat(),
}))
const viewAdaptive = computed(() => ({
  title: t('project.adaptive_version'),
  subtitle: t('project.adaptive_version_subtitle'),
  images: pagesMobile.value.map(o => o.images).flat(),
}))
</script>

<style lang="scss" src="./style.scss" scoped/>