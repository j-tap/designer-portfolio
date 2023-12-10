<template>
  <div class="more-projects">
    <h2 class="more-projects__title">{{ t('project.more_my_projects') }}</h2>
    <ScrollBlock class="more-projects__wrap-list">
      <ul class="more-projects__list">
        <li
          v-for="project in props.items"
          :key="project.id"
          class="more-projects__list-item"
        >
          <ProjectPreview
            :data="project"
            :to="{
              name: 'portfolio-category-project',
              params: { category: categoryName, project: project.slug }
            }"
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

const { t } = useI18n()
const route = useRoute()
const props = defineProps({
  items: Array,
})

const categoryName = computed(() => route.params.category)
</script>

<style lang="scss" src="./style.scss" scoped />