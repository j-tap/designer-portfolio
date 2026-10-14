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
            :to="projectLink(project)"
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
import { projectPath } from '~/config/portfolio'

const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  // Проекты той же категории (и подкатегории), что и открытый: ссылки — в том же разделе
  categorySlug: {
    type: String,
    required: true,
  },
  subcategorySlug: {
    type: String,
    default: null,
  },
})

function projectLink ({ slug }) {
  const path = projectPath({ category: props.categorySlug, subcategory: props.subcategorySlug }, slug)
  return path && localePath(path)
}
</script>

<style lang="scss" src="./style.scss" scoped />
