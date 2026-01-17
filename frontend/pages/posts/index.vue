<template>
  <div class="page-posts">
    <ContentWrap>
      <div class="page-posts__head page-posts-head">
        <TitleOutline
          class="page-posts-head__title"
          tag="h1"
        >
          {{ t('menu.posts') }}
        </TitleOutline>
      </div>
      <div class="page-posts__list">
        <PostsList :items="posts" :pending="pending" />
      </div>
      <div v-if="hasPrev || hasNext" class="page-posts__pagination">
        <NuxtLink
          v-if="hasPrev"
          :to="prevLink"
          class="page-posts__pagination-btn"
        >
          {{ t('posts.prev') }}
        </NuxtLink>
        <span
          v-else
          class="page-posts__pagination-btn page-posts__pagination-btn_disabled"
        >
          {{ t('posts.prev') }}
        </span>
        <span class="page-posts__pagination-page">{{ currentPage }}</span>
        <NuxtLink
          v-if="hasNext"
          :to="nextLink"
          class="page-posts__pagination-btn"
        >
          {{ t('posts.next') }}
        </NuxtLink>
        <span
          v-else
          class="page-posts__pagination-btn page-posts__pagination-btn_disabled"
        >
          {{ t('posts.next') }}
        </span>
      </div>
    </ContentWrap>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { PostsList } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'
import { getPostTitle, getPostImage } from '~/utils/post'

const { t } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()

definePageMeta({
  key: route => route.fullPath
})

const currentPage = computed(() => {
  const page = route.query.page
  return Math.max(1, parseInt(page) || 1)
})

const { data: postsData, error, pending } = await useFetch('/api/posts', {
  query: computed(() => ({ page: currentPage.value })),
  key: computed(() => `posts-page-${currentPage.value}`),
  server: true,
  default: () => ({ data: [], hasMore: false }),
  watch: [currentPage],
})

if (error.value) {
  console.error('Ошибка загрузки постов:', error.value)
}

const posts = computed(() => {
  if (!postsData.value?.data || !Array.isArray(postsData.value.data)) {
    return []
  }
  return postsData.value.data
})

const hasNext = computed(() => postsData.value?.hasMore === true)
const hasPrev = computed(() => currentPage.value > 1)

const nextLink = computed(() => {
  if (!hasNext.value) return null
  const nextPage = currentPage.value + 1
  return `?page=${nextPage}`
})

const prevLink = computed(() => {
  if (!hasPrev.value) return null
  const prevPage = currentPage.value - 1
  return prevPage > 1 ? `?page=${prevPage}` : route.path
})

const pageTitle = computed(() => t('menu.posts'))
const pageDescription = computed(() => {
  const count = posts.value.length
  return t('posts.description', { count }) || `${pageTitle.value} - ${t('app.name')}`
})

useHead(metaInfo({
  title: pageTitle,
  description: pageDescription,
}))

const baseUrl = config.public.baseURL
const currentUrl = computed(() => {
  const path = route.path.replace(/^\/[a-z]{2}(\/|$)/, '/')
  return `${baseUrl}${path}`
})

const blogSchema = computed(() => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: pageTitle.value,
    description: pageDescription.value,
    url: currentUrl.value,
      blogPost: posts.value.slice(0, 10).map(post => ({
        '@type': 'BlogPosting',
        headline: getPostTitle(post),
        datePublished: post.created_at,
        author: {
          '@type': 'Person',
          name: post.author?.full_name || '',
        },
        image: getPostImage(post) || undefined,
        mainEntityOfPage: post.url ? {
          '@type': 'WebPage',
          '@id': post.url,
        } : undefined,
      })),
  }
})


watch(blogSchema, (schema) => {
  if (schema && posts.value.length > 0) {
    useHead({
      script: [{
        type: 'application/ld+json',
        children: JSON.stringify(schema),
        key: 'blog-structured-data',
      }],
    })
  }
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped src="./style.scss"/>
