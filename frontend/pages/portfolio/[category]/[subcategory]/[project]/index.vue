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
import { getMoreProjects, getProjectData, getProjectMeta } from '~/composables/useProject'

const route = useRoute()
const router = useRouter()
const categorySlug = computed(() => route.params.category)
const subcategorySlug = computed(() => route.params.subcategory)
const projectSlug = computed(() => route.params.project)
const project = getProjectData(projectSlug, categorySlug, {
  categories: { slug: { $in: categorySlug.value } },
})
const moreProjectsList = getMoreProjects({
  slug: { $ne: projectSlug.value },
  categories: { slug: { $in: categorySlug.value } },
  subcategories: { slug: { $in: subcategorySlug.value } },
})
const projectMeta = getProjectMeta(project, categorySlug)

watch(project, (val) => {
  if (!val.id) {
    router.push({
      name: 'portfolio-category-subcategory',
      params: { category: categorySlug.value, subcategory: projectSlug.value },
    })
  }
}, { deep: true })

useHead(metaInfo({
  title: projectMeta.value.title,
  description: projectMeta.value.description,
  image: projectMeta.value.img,
  keywords: projectMeta.value.keywords,
}))
</script>
