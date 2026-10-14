<template>
  <div class="page-post">
    <ContentWrap>
      <article v-if="post" class="post-full" itemscope itemtype="https://schema.org/BlogPosting">
        <BackLink
          to="/posts"
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
                {{ formatPostDate(post, { t, d }) }}
              </time>
            </header>
            
            <div class="post-full__content" itemprop="articleBody">
              <div class="post-full__text">{{ post.text }}</div>
            </div>
            
            <footer class="post-full__footer">

              <a 
                v-if="safeUrl(post.url)" 
                :href="safeUrl(post.url)" 
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
          to="/posts"
          class="post-full__back"
        >
          {{ t('posts.back_to_list') }}
        </BackLink>
      </article>
      
      <div v-else class="post-full__not-found">
        <p>{{ t('posts.not_found') }}</p>
        <BackLink
          to="/posts"
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
import { getPostTitle, getPostImage, formatPostDate } from '~/utils/post'
import { safeUrl } from '~/utils/url'

const absoluteUrl = useAbsoluteUrl()

const { t, d } = useI18n()
const route = useRoute()

const { data: postData, error } = await useFetch(`/api/posts/${route.params.id}`, {
  key: `post-${route.params.id}`,
  default: () => ({ data: null }),
})

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 404,
    statusMessage: error.value.statusMessage || 'Post not found',
  })
}

const post = computed(() => postData.value?.data || null)
const pageTitle = computed(() => (post.value ? getPostTitle(post.value) : t('menu.posts')))
const pageDescription = computed(() => post.value?.text?.replace(/\n/g, ' ').trim() || t('posts.description'))

usePageMeta({
  title: pageTitle,
  description: pageDescription,
  image: () => post.value && getPostImage(post.value),
  type: 'article',
})

useJsonLd(() => post.value && {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: pageTitle.value,
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
    '@id': absoluteUrl(route.path),
  },
  url: post.value.url || absoluteUrl(route.path),
}, 'blogpost')

function getPostImageAlt (post) {
  return getPostTitle(post) || t('posts.image_alt')
}
</script>

<style lang="scss" scoped src="./style.scss"/>
