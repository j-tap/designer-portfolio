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
        <PostsList :items="posts" />
      </div>
      <div v-if="prevLink || nextLink" class="page-posts__pagination">
        <NuxtLink
          v-if="prevLink"
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
          v-if="nextLink"
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
import { getPostTitle, getPostImage } from '~/utils/post'

const absoluteUrl = useAbsoluteUrl()

const { t } = useI18n()
const route = useRoute()

const currentPage = computed(() => Math.max(1, parseInt(route.query.page) || 1))

const { data: postsData, error } = await useFetch('/api/posts', {
  query: computed(() => ({ page: currentPage.value })),
  key: computed(() => `posts-page-${currentPage.value}`),
  default: () => ({ data: [], hasMore: false }),
})

if (error.value) {
  console.error('Ошибка загрузки постов:', error.value)
}

const posts = computed(() => (Array.isArray(postsData.value?.data) ? postsData.value.data : []))

const nextLink = computed(() => (postsData.value?.hasMore === true ? `?page=${currentPage.value + 1}` : null))
const prevLink = computed(() => {
  if (currentPage.value <= 1) return null
  return currentPage.value > 2 ? `?page=${currentPage.value - 1}` : route.path
})

const pageTitle = computed(() => t('menu.posts'))
const pageDescription = computed(() => t('posts.description', { count: posts.value.length }))

usePageMeta({
  title: pageTitle,
  description: pageDescription,
})

useJsonLd(() => posts.value.length && {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: pageTitle.value,
  description: pageDescription.value,
  url: absoluteUrl(currentPage.value > 1 ? `${route.path}?page=${currentPage.value}` : route.path),
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
}, 'blog')

// Переход между страницами списка — тот же адрес с другим ?page: Nuxt в этом случае
// прокрутку не сбрасывает, поднимаем к началу списка сами
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style lang="scss" scoped src="./style.scss"/>
