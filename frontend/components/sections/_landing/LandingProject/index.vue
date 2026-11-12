<template>
  <div class="landing-project" @click="zoomImage">
    <p v-if="pending" class="landing-project__status">{{ t('landing.project_loading') }}</p>

    <PortfolioProject
      v-else-if="project && place"
      :project="project"
      :category-slug="place.category"
      :subcategory-slug="place.subcategory"
      embedded
    />

    <!-- Проект не загрузился: остаётся ссылка на его страницу -->
    <p v-else class="landing-project__status">{{ t('landing.project_error') }}</p>

    <aside class="landing-project__actions">
      <p class="landing-project__text">{{ t('landing.cta_text') }}</p>
      <div class="landing-project__buttons">
        <button class="btn landing-project__btn" type="button" @click="emit('contact')">{{ contactLabel }}</button>
        <NuxtLink v-if="pagePath" class="landing-project__page-link" :to="localePath(pagePath)">
          {{ t('landing.project_page') }}
        </NuxtLink>
      </div>
    </aside>

    <ImageZoom v-model="zoomSrc" :alt="zoomAlt" />
  </div>
</template>

<script setup>
/**
 * Проект в окне на посадочной странице: та же раскладка, что на странице проекта в портфолио
 * (PortfolioProject), но без ссылок, уводящих со страницы. В конце — призыв связаться
 * и ссылка на полную страницу проекта. Клик по картинке открывает её на весь экран.
 * Данные загружаются при открытии окна, а не вместе с посадочной.
 */
import { ImageZoom } from '~/components/common'
import { PortfolioProject } from '~/components/sections'
import { projectPath, projectPlaces } from '~/config/portfolio'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
  // Текст кнопки — тот же, что в блоке контактов посадочной
  contactLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['contact'])

const { t } = useI18n()
const localePath = useLocalePath()

const { data: project, pending } = useProject({ slug: { $eq: props.slug } }, { required: false })

// Раздел портфолио определяет раскладку проекта и адрес его страницы
const place = computed(() => (project.value ? projectPlaces(project.value)[0] : null))
const pagePath = computed(() => place.value && projectPath(place.value, props.slug))

const zoomSrc = ref(null)
const zoomAlt = ref('')

// Картинки проекта выводят разные блоки (ImgBlock), поэтому клик ловим здесь, а не в каждом.
// В src у ImgBlock — оригинал, srcset — уменьшенные копии
function zoomImage (event) {
  const img = event.target.closest?.('img')
  if (!img || img.closest('a, button') || img.closest('.image-zoom')) return
  const src = img.getAttribute('src')
  if (!src) return
  zoomAlt.value = img.alt || ''
  zoomSrc.value = src
}
</script>

<style lang="scss" src="./style.scss" scoped />
