<template>
  <div class="posts-list-wrap">
  <ul v-if="processedPosts?.length" class="posts-list">
    <li
      v-for="(post, index) in processedPosts"
      :key="post.id"
      :id="`post-${post.id}`"
      ref="listItems"
      :data-index="index"
      :style="{ zIndex: processedPosts.length - index }"
      class="posts-list__item"
    >
      <article class="post" itemscope itemtype="https://schema.org/BlogPosting">
        <NuxtLink
          :to="post.url"
          class="post__link"
        >
          <figure class="post__inner">
            <div class="post__image" :class="{ 'post__image_empty': !post.image || imageErrors[post.id] }">
              <img
                v-if="post.image && !imageErrors[post.id]"
                :src="post.image"
                :alt="post.imageAlt"
                itemprop="image"
                loading="lazy"
                @error="onImageError(post.id)"
              />
            </div>
            <div class="post__content">
              <h2 class="post__title" itemprop="headline">{{ post.title }}</h2>
              <p class="post__text" itemprop="articleBody">{{ post.preview }}</p>
              <time 
                class="post__date" 
                :datetime="post.created_at"
                itemprop="datePublished"
              >
                {{ post.formattedDate }}
              </time>
            </div>
          </figure>
        </NuxtLink>
      </article>
    </li>
  </ul>
  <p v-else class="posts-list__empty">{{ t('posts.empty') }}</p>
  </div>
</template>

<script setup>
import { getPostTitle, getPostImage, getPostPreview, formatPostDate } from '~/utils/post'

const { t, d } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const imageErrors = ref({})

function onImageError (postId) {
  imageErrors.value[postId] = true
}

const processedPosts = computed(() => props.items.map((post) => {
  const title = getPostTitle(post)

  return {
    ...post,
    image: getPostImage(post),
    imageAlt: title || t('posts.image_alt'),
    title,
    preview: getPostPreview(post),
    url: localePath(`/posts/${post.id}`),
    formattedDate: formatPostDate(post, { t, d }),
  }
}))

useParallax(useTemplateRef('listItems'))
</script>

<style lang="scss" scoped src="./style.scss"/>
