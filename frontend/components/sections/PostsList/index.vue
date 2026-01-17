<template>
  <div class="posts-list-wrap">
    <ul v-if="processedPosts?.length" class="posts-list">
      <li
        v-for="post in processedPosts"
        :key="post.id"
        :id="`post-${post.id}`"
        :ref="setPostElems"
        class="posts-list__item"
      >
        <article class="post" itemscope itemtype="https://schema.org/BlogPosting">
          <NuxtLink
            :to="post.url"
            class="post__link"
          >
            <figure class="post__inner">
              <div v-if="post.image" class="post__image">
                <img
                  :src="post.image"
                  :alt="post.imageAlt"
                  itemprop="image"
                  loading="lazy"
                />
              </div>
              <div v-else class="post__image post__image_empty"></div>
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
import { dateFormat } from '~/utils/formatDate'
import { getPostTitle, getPostImage, getPostPreview } from '~/utils/post'
import {
  updateProjectsPrlx,
  resetParalax,
  elems as postElems,
} from '~/composables/useElemsParalax'

const { t, locale } = useI18n()

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const localePath = useLocalePath()

const processedPosts = computed(() => {
  if (!props.items?.length) return []
  
  return props.items.map(post => {
    const image = getPostImage(post)
    const title = getPostTitle(post)
    
    return {
      ...post,
      image,
      imageAlt: title || t('posts.image_alt'),
      title,
      preview: getPostPreview(post),
      url: localePath(`/posts/${post.id}`),
      formattedDate: dateFormat(post.created_at, {}, locale.value),
    }
  })
})

function setPostElems(el) {
  if (el) {
    postElems.value.push(el)
  }
}

if (process.client) {
  let rafId = null
  let scrollHandler = null

  onMounted(() => {
    resetParalax()
    postElems.value = []
    
    if (window.innerWidth >= 768) {
      scrollHandler = () => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
          updateProjectsPrlx(props.items, window.scrollY)
          rafId = null
        })
      }
      window.addEventListener('scroll', scrollHandler, { passive: true })

      nextTick(() => {
        updateProjectsPrlx(props.items, window.scrollY)
      })
    }
  })

  onBeforeUnmount(() => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    resetParalax()
    postElems.value = []
  })
}
</script>

<style lang="scss" scoped src="./style.scss"/>
