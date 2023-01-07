<template>
  <div class="page-project">
    <ContentWrap>
      <h1 class="page-project__title">{{ project.title }}</h1>
      <div class="page-project__time project-time">
        <div class="project-time__dates">
          <h2 class="project-time__title">{{ $t('project.development_time') }}</h2>
          <TitleOutline class="project-time__value" tag="time">
            {{ dateFormat(project.time.start) }}
          </TitleOutline>
          <TitleOutline class="project-time__value" tag="time">
            {{ dateFormat(project.time.end) }}
          </TitleOutline>
        </div>
        <div class="project-time__prices">
          <h2 class="project-time__title">{{ $t('project.price') }}</h2>
          <TitleOutline class="project-time__value" tag="div">
            {{ projectTimeHours }} {{ $t('common.hours') }}
          </TitleOutline>
          <TitleOutline class="project-time__value" tag="div">
            {{ projectTimePrice }} ₽
          </TitleOutline>
        </div>
      </div>
      <div class="page-project__steps project-steps">
        <h2 class="project-steps__title">{{ $t('project.steps') }}</h2>
        <ol class="project-steps__list">
          <li
            v-for="step in project.steps"
            :key="step.id"
            class="project-steps__list-item"
          >
            {{ step.title }}
          </li>
        </ol>
      </div>
      <div class="page-project__back">
        <NuxtLink
          :to="{ name: 'portfolio-category', params: { category: categoryName } }"
        >
          &larr; {{ $t('portfolio.back_to_portfolio') }}
        </NuxtLink>
      </div>
      <div class="page-project__content">
        <Component :is="projectComponentName" :data="project" />
      </div>
    </ContentWrap>
    <pre>{{ project }}</pre>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { ProjectMobile, ProjectUiUx } from '~/components/sections'
import { datesDiff, dateFormat, getWeekendsDays } from '~/utils/formatDate'

import projects from '~/mocks/projects.js'

const RATE = 1200
const HOURS_DAY = 8

const categoryToComponent = {
  'mobile-development': ProjectMobile,
  'ui-ux-design': ProjectUiUx,
}
const route = useRoute()
const categoryName = computed(() => route.params.category)
const project = computed(() => projects.filter(o => o.name === route.params.project).pop() || {})
const projectComponentName = shallowRef('')

const projectTimeHours = computed(() => {
  const { time } = project.value

  if (time) {
    const weekends = getWeekendsDays(time.start, time.end)
    const days = datesDiff(time.start, time.end, 'd')

    return (days - weekends.length) * HOURS_DAY
  }

  return 0
})
const projectTimePrice = computed(() => projectTimeHours.value * RATE)

onMounted(() => {
  projectComponentName.value = categoryToComponent[categoryName.value]
})
</script>

<style lang="scss" src="./style.scss" scoped/>