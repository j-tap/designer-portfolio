<template>
  <div class="page-project">
    <ContentWrap>
      <PortfolioProject
        :project="project"
        :more-projects="moreProjects"
        :category-slug="categorySlug"
        :subcategory-slug="subcategorySlug"
      />
    </ContentWrap>
  </div>
</template>

<script setup>
import { ContentWrap } from '~/components/structure'
import { PortfolioProject } from '~/components/sections'

// /portfolio/<категория>/<подкатегория>/<проект>
const route = useRoute()
const { category: categorySlug, slug: subcategorySlug, project: projectSlug } = route.params

const { data: project } = await useProject({
  slug: { $eq: projectSlug },
  categories: { slug: { $eq: categorySlug } },
  subcategories: { slug: { $eq: subcategorySlug } },
})

const { moreProjects } = useProjectPage(project, { categorySlug, subcategorySlug })
</script>
