<template>
  <div class="page-project">
    <ContentWrap>
      <Transition>
        <div v-if="project?.id">
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
            <h1 class="page-project__title">
              <NuxtLink
                v-if="project.link"
                :to="project.link"
                target="_blank"
                external
              >
                {{ project.title }}
              </NuxtLink>
              <template v-else>{{ project.title }}</template>
            </h1>
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
            <Component
              :is="projectComponentName"
              :data="project"
            />
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

const project = ref({})
const moreProjectsList = ref([])

const categoryName = computed(() => route.params.category)

project.value = await fetchProjects()
moreProjectsList.value = await fetchMore()

if (!project.value?.id) {
  display404()
}

const metaTitle = computed(() => `${project.value?.title || '404'} / ${categoryName.value}`)
const metaImage = computed(() =>
  project.value?.preview_social ?
  project.value.preview_social?.url ||
  project.value.preview?.formats.medium.url :
  null
)
const projectComponentName = computed(() => categoryToComponent[categoryName.value])

async function fetchProjects () {
  const resp = await findBySlug(
    'projects',
    route.params.project,
    {
      filters: {
        categories: {
          slug: { $in: categoryName.value },
        },
      },
    }
  )

  if (resp?.data) {
    resp.data.pages = resp.data.pages.filter(o => o.active !== false)
  }

  return resp?.data
}

async function fetchMore () {
  const resp = await find(
    'projects',
    {
      filters: {
        id: { $ne: project.value?.id },
        categories: { id: { $in: project.value?.categories?.map((o) => o.id) } },
      },
      pagination: { pageSize: 15 },
    }
  )

  return resp?.data ? resp.data.sort(() => 0.5 - Math.random()) : []
}

useHead(metaInfo({
  title: metaTitle.value,
  description: project.value?.subtitle,
  image: metaImage.value,
}))
</script>

<style lang="scss" src="./style.scss" scoped/>