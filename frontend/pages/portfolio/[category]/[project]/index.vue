<template>
  <div class="page-project">
    <ContentWrap>
      <Transition>
        <PortfolioProject
          :project="project"
          :more-projects="moreProjectsList"
          :category-slug="categorySlug"
        />
      </Transition>
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { PortfolioProject } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { useStructuredData } from '~/composables/useStructuredData'
import { getMoreProjects, getProjectData, getProjectMeta } from '~/composables/useProject'

definePageMeta({
  middleware: 'portfolio',
})

const route = useRoute()
const { t } = useI18n()
const categorySlug = computed(() => route.params.category)
const projectSlug = computed(() => route.params.project)
const project = getProjectData(projectSlug, categorySlug, {
  categories: { slug: { $in: categorySlug.value } },
})
const moreProjectsList = getMoreProjects({
  slug: { $ne: projectSlug.value },
  categories: { slug: { $in: categorySlug.value } },
})
const projectMeta = getProjectMeta(project, categorySlug)

const headMeta = metaInfo({
  title: computed(() => project.value?.title ? projectMeta.title.value : null),
  description: computed(() => project.value?.title ? projectMeta.description.value : null),
  image: computed(() => project.value?.title ? projectMeta.img.value : null),
  keywords: computed(() => project.value?.title ? projectMeta.keywords.value : null),
})

useHead(headMeta)

const breadcrumbs = computed(() => {
  if (!project.value || !project.value.title) return null
  
  const crumbs = [
    { name: t('menu.portfolio') || 'Portfolio', url: '/portfolio' },
  ]
  
  const category = project.value.categories?.find(c => c.slug === categorySlug.value)
  if (category && category.title) {
    crumbs.push({
      name: category.title,
      url: `/portfolio/${categorySlug.value}`,
    })
  }
  
  if (project.value.title) {
    crumbs.push({
      name: project.value.title,
      url: route.path,
    })
  }
  
  return crumbs
})

const { getStructuredData } = useStructuredData('project', {
  project: project,
  breadcrumbs: breadcrumbs,
})

watch(getStructuredData, (schemas) => {
  if (schemas && schemas.length > 0) {
    useHead({
      script: schemas.map((schema, index) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
        key: `structured-data-${index}`,
      })),
    })
  }
}, { immediate: true, deep: true })
</script>
