<template>
  <div class="page-project">
    <ContentWrap>
      <Transition>
        <div v-if="isExist" v-show="isReady">
          <ul
            v-if="project.links?.length"
            class="page-project__links links-project"
          >
            <li
              v-for="item in project.links"
              :key="item.id"
              class="links-project__item"
            >
              <NuxtLink
                :to="item.link"
                class="links-project__link"
                target="_blank"
                external
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>

          <header class="page-project__head">
            <h1 class="page-project__title">{{ project.title }}</h1>
            <div v-if="project.subtitle" class="page-project__subtitle">{{ project.subtitle }}</div>
          </header>

          <ProjectTimes
            v-if="project.time?.start"
            :time="project.time"
            class="page-project__time"
          />

          <ProjectSteps
            v-if="project.steps?.length"
            :steps="project.steps"
            class="page-project__steps"
          />

          <ProjectBack
            class="page-project__back"
            :category-name="categoryName"
            :project-id="project.id"
          />

          <div class="page-project__content">
            <Component :is="projectComponentName" :data="project" />
          </div>

          <ProjectBack
            class="page-project__back"
            :category-name="categoryName"
            :project-id="project.id"
          />

          <ProjectMore
            v-if="moreProjectsList?.length"
            :items="moreProjectsList"
            class="page-project__more-projects"
          />
        </div>
      </Transition>
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import {
  ProjectTimes,
  ProjectSteps,
  ProjectTypeMobile,
  ProjectTypeUiUx,
  ProjectTypeWeb,
  ProjectTypeIdentity,
  ProjectMore,
  ProjectBack,
} from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { find, findBySlug } from '~/composables/useApi'
import { display404 } from '~/composables/useErrorContent'

const categoryToComponent = {
  'mobile-development': ProjectTypeMobile,
  'ui-ux-design': ProjectTypeUiUx,
  'web-design': ProjectTypeWeb,
  'identity': ProjectTypeIdentity,
}
const route = useRoute()
const router = useRouter()

const projectComponentName = shallowRef('')
const isExist = ref(false)
const isReady = ref(false)
const projectResp = ref(null)
const moreProjectsResp = ref(null)

const project = computed(() => {
  let data = projectResp.value?.data

  if (data) {
    data.pages = data.pages.filter(o => o.active !== false)
  }

  return data
})

const moreProjectsList = computed(() => moreProjectsResp.value?.data.length ?
    moreProjectsResp.value.data.sort(() => 0.5 - Math.random()) : [])

const categoryName = computed(() => route.params.category)

fetchProjects()
fetchMore()

watch(projectResp, (resp) => {
  isExist.value = !!resp?.data

  if (!isExist.value) {
    display404()
  }
})

useHead(metaInfo({
  title: `${project.value?.title} / ${categoryName.value}`,
  description: project.value?.subtitle,
  image: project.value?.preview_social ?
    project.value.preview_social?.url ||
    project.value.preview?.formats.medium.url :
    null,
}))

onMounted(() => {
  projectComponentName.value = categoryToComponent[categoryName.value]

  setTimeout(() => {
    isReady.value = true
  }, 400)
})

async function fetchProjects () {
  projectResp.value = await findBySlug(
    'projects',
    route.params.project,
  )
}

async function fetchMore () {
  moreProjectsResp.value = await find(
    'projects',
    {
      filters: {
        id: { $ne: project.value?.id },
        categories: { id: { $in: project.value?.categories.map((o) => o.id) } },
      },
      pagination: { pageSize: 15 },
    }
  )
}
</script>

<style lang="scss" src="./style.scss" scoped/>