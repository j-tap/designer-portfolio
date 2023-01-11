<template>
  <div class="page-category">
    <ContentWrap>
      <TitleOutline class="page-category__title" tag="h1">
        {{ category.title }}
      </TitleOutline>
      <ul class="page-category__projects projects-list">
        <li
          v-for="project in projectsList"
          :key="project.name"
          :id="`project-${project.id}`"
          :ref="setProjectElems"
          class="projects-list__item"
        >
          <ProjectPreview
            :data="project"
            :to="isCategoryIdentity ? null : {
              name: 'portfolio-category-project',
              params: { category: categoryName, project: project.name, hash: `project-${project.id}` }
            }"
            title-tag="h2"
            class="projects-list__item-preview"
          />
        </li>
      </ul>
    </ContentWrap>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { ProjectPreview } from '~/components/sections'
import { getElementViewportInfo } from '~/utils/check'
import { setMeta } from '~/composables/useMeta'
import categories from '~/mocks/categories.js'
import projects from '~/mocks/projects.js'

const { t } = useI18n()
const route = useRoute()
const categoryName = computed(() => route.params.category)
const isCategoryIdentity = computed(() => categoryName.value === 'identity')
const category = computed(() => categories.filter(o => o.name === categoryName.value).pop() || {})
const projectsList = computed(() => projects.map(o => ({
  id: o.id,
  name: o.name,
  preview: o.preview,
  title: o.title,
})))
const projectElems = ref([])
const projectElesScrlStarts = ref([])

if (process.client) {
  window.addEventListener('scroll', () => {
    updateProjectsPrlx(projectsList.value, window.scrollY)
  })
}

function setProjectElems (el) {
  if (el) {
    // TODO: Need clean after updated
    projectElems.value.push(el)
  }
}

function updateProjectsPrlx (list, scrl = 0) {
  if (process.client) {
    list.forEach((o, ind) => {
      const el = projectElems.value[ind]
      const { isInViewport } = getElementViewportInfo(el)

      if (isInViewport) {
        if (!projectElesScrlStarts.value[ind]) {
          projectElesScrlStarts.value[ind] = scrl
        }

        let k = 0

        if (ind > 0) {
          if (ind === 2 || ind % 9 === 0) {
            k = 9
          } else if (ind === 4 || ind % 11 === 0) {
            k = 11
          } else if (ind === 5 || ind % 12 === 0) {
            k = 7
          } else if (ind === 6 || ind % 13 === 0) {
            k = 9
          }
        }

        if (k) {
          const scrlStart = projectElesScrlStarts.value[ind]
          const y = (scrl - scrlStart) / k
          el.style.transform = `translateY(${y}px)`
        }
      }
    })
  }
}

setMeta({
  title: category.value.title,
})

definePageMeta({
  key: route => route.fullPath
})
</script>

<style lang="scss" src="./style.scss" scoped/>