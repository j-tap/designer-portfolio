// Глобальный кеш всех постов
const CACHE_TTL = 24 * 60 * 60 * 1000
const LINKEDIN_USER_NAME = process.env.LINKEDIN_USER_NAME
const VR9_API_KEY = process.env.VR9_API_KEY
const BASE_URL_API = 'https://vr9.pro/api/services/linkedin/posts'

let allPostsCache = {
  data: [],
  timestamp: null,
  username: null,
}

export function clearPostsCache() {
  allPostsCache = { data: [], timestamp: null, username: null }
}

export function isCacheValid() {
  const now = Date.now()
  return allPostsCache.data.length > 0 && 
         allPostsCache.timestamp && 
         (now - allPostsCache.timestamp) < CACHE_TTL
}

export function getCachedPosts() {
  return allPostsCache
}

export function getPostById(id) {
  const idStr = String(id)
  return allPostsCache.data.find(p => String(p.id) === idStr) || null
}

function mapPost(post, username) {
  return {
    id: post.id,
    text: post.text,
    url: post.link,
    image: post.image || null,
    created_at: post.fetchedAt ? new Date(post.fetchedAt).toISOString() : null,
    date_raw: post.date?.raw,
    date_value: post.date?.value,
    date_unit: post.date?.unit,
    num_likes: post.likes || 0,
    num_comments: post.comments || 0,
    num_reposts: post.reposts || 0,
    author: {
      full_name: username || LINKEDIN_USER_NAME,
    },
    content: post.image ? {
      images: [{
        image: [{
          url: post.image,
          width: 800,
        }],
      }],
    } : null,
  }
}

export async function fetchAllPosts(forceUpdate = false) {
  if (!forceUpdate && isCacheValid()) {
    return allPostsCache
  }

  const allPosts = []
  let page = 1
  const limit = 50 // Запрашиваем больше за раз для эффективности
  let hasMore = true
  let username = null

  while (hasMore && page <= 10) { // Максимум 10 страниц = 500 постов
    const offset = (page - 1) * limit
    const url = `${BASE_URL_API}?key=${VR9_API_KEY}&username=${LINKEDIN_USER_NAME}&limit=${limit}&offset=${offset}`

    try {
      const response = await $fetch(url, { method: 'GET' })

      if (!response?.success) {
        break
      }

      username = response.username || LINKEDIN_USER_NAME
      const posts = (response.posts || []).map(p => mapPost(p, username))
      allPosts.push(...posts)

      hasMore = posts.length === limit
      page++
    } catch (error) {
      console.error(`[POSTS CACHE] Error fetching page ${page}:`, error?.message)
      break
    }
  }

  allPostsCache = {
    data: allPosts,
    timestamp: Date.now(),
    username,
  }

  return allPostsCache
}
