<template>
  <div class="landing-project" @click="zoomImage">
    <Transition name="landing-project-fade" mode="out-in">
      <!-- Скелет в форме проекта: окно сразу нужной высоты и не прыгает, пока грузятся данные -->
      <div v-if="pending" key="skeleton" class="project-skeleton" role="status">
        <span class="sr-only">{{ t('landing.project_loading') }}</span>
        <div class="project-skeleton__bar project-skeleton__bar_links" />
        <div class="project-skeleton__bar project-skeleton__bar_title" />
        <div class="project-skeleton__bar project-skeleton__bar_subtitle" />

        <div class="project-skeleton__facts">
          <div v-for="fact in 2" :key="fact" class="project-skeleton__fact">
            <div class="project-skeleton__bar project-skeleton__bar_label" />
            <div class="project-skeleton__bar project-skeleton__bar_value" />
            <div class="project-skeleton__bar project-skeleton__bar_value" />
          </div>
        </div>

        <div class="project-skeleton__steps">
          <div v-for="step in 4" :key="step" class="project-skeleton__bar project-skeleton__bar_step" />
        </div>

        <div class="project-skeleton__images">
          <div v-for="image in 4" :key="image" class="project-skeleton__bar project-skeleton__bar_image" />
        </div>
      </div>

      <PortfolioProject
        v-else-if="project && place"
        key="project"
        :project="project"
        :category-slug="place.category"
        :subcategory-slug="place.subcategory"
        embedded
      />

      <!-- Проект не загрузился: остаётся ссылка на его страницу -->
      <p v-else key="error" class="landing-project__status">{{ t('landing.project_error') }}</p>
    </Transition>

    <!-- Появляется вместе с проектом, а не до него: иначе блок уезжал бы вниз, когда проект загрузится -->
    <aside v-if="!pending" class="landing-project__actions">
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
