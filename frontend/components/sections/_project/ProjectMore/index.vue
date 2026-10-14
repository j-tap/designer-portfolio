<template>
  <div class="more-projects">
    <h2 class="more-projects__title">{{ t('project.more_my_projects') }}</h2>
    <ScrollBlock class="more-projects__wrap-list">
      <ul class="more-projects__list">
        <li
          v-for="project in items"
          :key="project.id"
          class="more-projects__list-item"
        >
          <ProjectPreview
            :data="project"
:to="localePath(portfolioPath(categorySlug, project.slug))"
            class="more-projects__item-preview"
          />
        </li>
      </ul>
    </ScrollBlock>
  </div>
</template>

<script setup>
import { ScrollBlock } from '~/components/common'
import { ProjectPreview } from '~/components/sections'
import { portfolioPath } from '~/config/portfolio'

const { t } = useI18n()
const localePath = useLocalePath()

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  categorySlug: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" src="./style.scss" scoped />