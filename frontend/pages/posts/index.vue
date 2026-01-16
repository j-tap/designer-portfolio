<template>
  <div class="page-posts">
    <ContentWrap>
      <TitleOutline class="page-posts__title">{{ t('menu.posts') }}</TitleOutline>
      <PostsList :items="posts" />
    </ContentWrap>
  </div>
</template>

<script setup>
import { TitleOutline } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { PostsList } from '~/components/sections'
import { metaInfo } from '~/composables/useMeta'

const { t } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()

definePageMeta({
  key: route => route.fullPath
})

const { data: postsData, error } = await useFetch('/api/posts', {
  server: true,
  default: () => ({ data: [] }),
  getCachedData: (key) => {
    const nuxtApp = useNuxtApp()
    return nuxtApp.payload?.data?.[key] ?? nuxtApp.payload?.static?.[key]
  },
})

if (error.value) {
  console.error('Ошибка загрузки постов:', error.value)
}

const POSTS_PER_PAGE = 15

const posts = computed(() => {
  if (!postsData.value?.data || !Array.isArray(postsData.value.data)) {
    return []
  }
  return postsData.value.data.slice(0, POSTS_PER_PAGE)
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
      headline: post.text ? (post.text.length > 100 ? post.text.substring(0, 97) + '...' : post.text) : '',
      datePublished: post.created_at,
      author: {
        '@type': 'Person',
        name: post.author?.full_name || '',
      },
      image: getPostImage(post),
      mainEntityOfPage: post.url ? {
        '@type': 'WebPage',
        '@id': post.url,
      } : undefined,
    })),
  }
})

function getPostImage(post) {
  if (!post?.content?.images || !Array.isArray(post.content.images) || post.content.images.length === 0) {
    return undefined
  }

  const firstImageSet = post.content.images[0]
  if (!firstImageSet?.image || !Array.isArray(firstImageSet.image)) {
    return undefined
  }

  const targetWidth = 1280
  let bestImage = null
  let bestWidth = 0

  for (const img of firstImageSet.image) {
    if (img.width && img.url) {
      if (img.width === targetWidth) {
        return img.url
      }
      if (img.width < targetWidth && img.width > bestWidth) {
        bestWidth = img.width
        bestImage = img.url
      }
    }
  }

  if (!bestImage) {
    for (const img of firstImageSet.image) {
      if (img.width && img.url && img.width > bestWidth) {
        bestWidth = img.width
        bestImage = img.url
      }
    }
  }

  return bestImage
}

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
