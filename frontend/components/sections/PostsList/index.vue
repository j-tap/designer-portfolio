<template>
  <ul v-if="items?.length" class="posts-list">
    <li
      v-for="post in items"
      :key="post.id"
      class="posts-list__item"
    >
      <article class="post" itemscope itemtype="https://schema.org/BlogPosting">
        <NuxtLink
          v-if="showLinks"
          :to="getPostUrl(post)"
          class="post__link"
        >
          <div class="post__body">
            <div class="post__content">
              <h2 class="post__title" itemprop="headline">{{ getPostTitle(post) }}</h2>
              <p class="post__text" itemprop="articleBody">{{ getPostPreview(post) }}</p>
              <time 
                class="post__date" 
                :datetime="post.created_at"
                itemprop="datePublished"
              >
                {{ dateFormat(post.created_at) }}
              </time>
            </div>
            
            <div v-if="postImage(post)" class="post__image">
              <img
                :src="postImage(post)"
                :alt="getPostImageAlt(post)"
                itemprop="image"
                loading="lazy"
              />
            </div>
          </div>
        </NuxtLink>
        
        <template v-else>
          <div class="post__body">
            <div class="post__content">
              <h2 class="post__title" itemprop="headline">{{ getPostTitle(post) }}</h2>
              <div class="post__text" itemprop="articleBody">{{ post.text }}</div>
              <time 
                class="post__date" 
                :datetime="post.created_at"
                itemprop="datePublished"
              >
                {{ dateFormat(post.created_at) }}
              </time>
            </div>
            
            <div v-if="postImage(post)" class="post__image">
              <img
                :src="postImage(post)"
                :alt="getPostImageAlt(post)"
                itemprop="image"
                loading="lazy"
              />
            </div>
          </div>
        </template>
      </article>
    </li>
  </ul>
  <p v-else class="posts-list__empty">{{ t('posts.empty') }}</p>
</template>

<script setup>
import { dateFormat } from '~/utils/formatDate'
import { getPostTitle, getPostImage, getPostPreview } from '~/utils/post'

const { t } = useI18n()

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  showLinks: {
    type: Boolean,
    default: true,
  },
})

const localePath = useLocalePath()

function postImage(post) {
  return getPostImage(post)
}

function getPostImageAlt(post) {
  const title = getPostTitle(post)
  return title || t('posts.image_alt')
}

function getPostUrl(post) {
  return localePath(`/posts/${post.id}`)
}
</script>

<style lang="scss" scoped src="./style.scss"/>
