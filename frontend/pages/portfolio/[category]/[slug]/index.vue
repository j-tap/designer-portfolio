<template>
  <div v-if="project" class="page-project">
    <ContentWrap>
      <PortfolioProject
        :project="project"
        :more-projects="moreProjects"
        :category-slug="categorySlug"
      />
    </ContentWrap>
  </div>
  <div v-else class="page-subcategory">
    <ContentWrap>
      <PortfolioCategory
        :projects="projects"
        :category-slug="categorySlug"
        :subcategory-slug="subcategory.slug"
        :category="subcategory"
        :subcategories="subcategories"
        :title="subcategory.category.title"
        :locale="subcategory.locale"
        :back="{ to: portfolioPath(categorySlug), title: t('portfolio.back_to_{category}', { category: subcategory.category.title }) }"
      />
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { PortfolioCategory, PortfolioProject } from '~/components/sections'
import { portfolioPath, sortByRank } from '~/config/portfolio'

// /portfolio/<категория>/<slug> — это проект категории или её подкатегория: решают данные
const { t } = useI18n()
const route = useRoute()
const { category: categorySlug, slug } = route.params

const { data: project } = await useProject({
  slug: { $eq: slug },
  categories: { slug: { $eq: categorySlug } },
}, { required: false })

let moreProjects, subcategory, subcategories, projects

if (project.value) {
  ({ moreProjects } = useProjectPage(project, { categorySlug }))
}
else {
  ({ data: subcategory } = await useRequiredStrapiData('subcategory-projects', {
    filters: { slug: { $eq: slug }, category: { slug: { $eq: categorySlug } } },
  }, { single: true }))

  subcategories = computed(() => sortByRank(subcategory.value.category.subcategories))
  ;({ data: projects } = await useProjectsList({
    subcategories: { slug: { $eq: slug } },
  }, { default: () => [] }))

  // В title — и подкатегория, иначе у всех подкатегорий категории одинаковый заголовок в выдаче
  usePortfolioListPage({
    title: () => `${subcategory.value.title} — ${subcategory.value.category.title}`,
    description: () => subcategory.value.description || subcategory.value.category.description,
    category: () => subcategory.value.category,
    subcategory,
    projects,
  })
}
</script>
