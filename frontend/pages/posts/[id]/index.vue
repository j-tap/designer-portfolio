<template>
  <div class="page-post">
    <ContentWrap>
      <article v-if="post" class="post-full" itemscope itemtype="https://schema.org/BlogPosting">
        <BackLink
          :to="'/posts'"
          class="post-full__back"
        >
          {{ t('posts.back_to_list') }}
        </BackLink>
        
        <div class="post-full__body">
          <div class="post-full__left">
            <header class="post-full__head">
              <h1 class="post-full__title" itemprop="headline">{{ getPostTitle(post) }}</h1>
              <time 
                class="post-full__date" 
                :datetime="post.created_at"
                itemprop="datePublished"
              >
                <template v-if="post.date_value !== undefined && post.date_unit">
                  {{ formatRelativeDate({ value: post.date_value, unit: post.date_unit, raw: post.date_raw }, t) }}
                </template>
                <template v-else-if="post.created_at">
                  {{ dateFormat(post.created_at, {}, locale) }}
                </template>
              </time>
            </header>
            
            <div class="post-full__content" itemprop="articleBody">
              <div class="post-full__text">{{ post.text }}</div>
            </div>
            
            <footer class="post-full__footer">

              <a 
                v-if="post.url" 
                :href="post.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="post-full__source"
              >
                {{ t('posts.view_on_linkedin') }}
              </a>
            </footer>
          </div>
          
          <div v-if="getPostImage(post)" class="post-full__right">
            <div class="post-full__image">
              <img
                :src="getPostImage(post)"
                :alt="getPostImageAlt(post)"
                itemprop="image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        
        <BackLink
          :to="'/posts'"
          class="post-full__back"
        >
          {{ t('posts.back_to_list') }}
        </BackLink>
      </article>
      
      <div v-else class="post-full__not-found">
        <p>{{ t('posts.not_found') }}</p>
        <BackLink
          :to="'/posts'"
          class="post-full__back"
        >
          {{ t('posts.back_to_list') }}
        </BackLink>
      </div>
    </ContentWrap>
  </div>
</template>

<script setup>
import { BackLink } from '~/components/common'
import { ContentWrap } from '~/components/structure'
import { metaInfo } from '~/composables/useMeta'
import { dateFormat, formatRelativeDate } from '~/utils/formatDate'
import { getPostTitle, getPostImage } from '~/utils/post'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
const localePath = useLocalePath()

definePageMeta({
  key: route => route.fullPath
})

const postId = computed(() => route.params.id)

const { data: postData, error } = await useFetch(`/api/posts/${postId.value}`, {
  server: true,
  default: () => ({ data: null }),
  key: `post-${postId.value}`,
})

const post = computed(() => {
  return postData.value?.data || null
})

const pageTitle = computed(() => {
  if (!post.value) return t('menu.posts')
  return getPostTitle(post.value)
})

const pageDescription = computed(() => {
  if (!post.value?.text) return t('posts.description')
  const text = post.value.text.replace(/\n/g, ' ').trim()
  return text.length > 160 ? text.substring(0, 157) + '...' : text
})

const pageImage = computed(() => {
  if (!post.value) return null
  return getPostImage(post.value)
})

useHead(metaInfo({
  title: pageTitle,
  description: pageDescription,
  image: pageImage,
}))

const baseUrl = config.public.baseURL
const currentUrl = computed(() => {
  const path = route.path.replace(/^\/[a-z]{2}(\/|$)/, '/')
  return `${baseUrl}${path}`
})

const blogPostSchema = computed(() => {
  if (!post.value) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: getPostTitle(post.value),
    description: pageDescription.value,
    datePublished: post.value.created_at,
    dateModified: post.value.created_at,
    author: {
      '@type': 'Person',
      name: post.value.author?.full_name || '',
    },
    image: getPostImage(post.value),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl.value,
    },
    url: post.value.url || currentUrl.value,
  }
})

function getPostImageAlt(post) {
  const title = getPostTitle(post)
  return title || t('posts.image_alt')
}

watch(blogPostSchema, (schema) => {
  if (schema && post.value) {
    useHead({
      script: [{
        type: 'application/ld+json',
        children: JSON.stringify(schema),
        key: 'blogpost-structured-data',
      }],
    })
  }
}, { immediate: true, deep: true })

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 404,
    statusMessage: error.value.statusMessage || 'Post not found'
  })
}
</script>

<style lang="scss" scoped src="./style.scss"/>
