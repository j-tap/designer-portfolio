<template>
  <div class="page-portfolio">
    <ContentWrap>
      <h1 class="page-portfolio__title">{{t('menu.portfolio')}}</h1>
      <PortfolioCategories :items="categories" />
    </ContentWrap>
  </div>
</template>

<script setup>
import { PortfolioCategories } from '~/components/sections'
import { ContentWrap } from '~/components/structure'
import { metaInfo } from '~/composables/useMeta'
import { useStructuredData } from '~/composables/useStructuredData'
import { serverFetch } from '~/composables/useApi'

const { t } = useI18n()
const categories = serverFetch('category-projects', {
  sort: [{ rank: 'asc' }],
}, [])

useHead(metaInfo({
  title: ref(t('menu.portfolio')),
}))

const collectionData = computed(() => categories.value ? {
  title: t('menu.portfolio') || 'Portfolio',
  description: t('menu.portfolio') || 'Portfolio',
  items: categories.value.map(category => ({
    title: category.title,
    url: `/portfolio/${category.slug}`,
  })),
} : null)

const { getStructuredData } = useStructuredData('collection', {
  collection: collectionData,
})

watch(getStructuredData, (schemas) => {
  if (schemas && schemas.length > 0) {
    useHead({
      script: schemas.map((schema, index) => ({
        type: 'application/ld+json',
        children: JSON.stringify(schema),
        key: `structured-data-${index}`,
      })),
    })
  }
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped src="./style.scss"/>