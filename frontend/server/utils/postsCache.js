// Глобальный кеш всех постов
const CACHE_TTL = 24 * 60 * 60 * 1000
// Если внешний API не ответил, а кеш пуст, повторяем не раньше чем через это время:
// иначе каждый просмотр раздела постов снова шёл бы в платный API
const RETRY_AFTER_FAILURE = 10 * 60 * 1000
const LINKEDIN_USER_NAME = process.env.LINKEDIN_USER_NAME
const VR9_API_KEY = process.env.VR9_API_KEY
const POSTS_UPDATE_TOKEN = process.env.POSTS_UPDATE_TOKEN
const BASE_URL_API = 'https://vr9.pro/api/services/linkedin/posts'

let pendingFetch = null
let lastFailureAt = 0

let allPostsCache = {
  data: [],
  timestamp: null,
  username: null,
}

export function isCacheValid() {
  const now = Date.now()
  return allPostsCache.data.length > 0 && 
         allPostsCache.timestamp && 
         (now - allPostsCache.timestamp) < CACHE_TTL
}

/**
 * Принудительное обновление (?update=true) тратит квоту платного API, поэтому
 * разрешено только с токеном из POSTS_UPDATE_TOKEN: ?update=true&token=...
 * Без заданного токена параметр игнорируется.
 */
export function canForceUpdate(query) {
  const wantsUpdate = query.update === 'true' || query.update === true
  return Boolean(wantsUpdate && POSTS_UPDATE_TOKEN && query.token === POSTS_UPDATE_TOKEN)
}

// В тексте ошибки ofetch есть полный URL запроса, а в нём ключ API
function redact(message) {
  return VR9_API_KEY ? String(message).replaceAll(VR9_API_KEY, '***') : message
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
  }
}

export async function fetchAllPosts(forceUpdate = false) {
  if (!forceUpdate && (isCacheValid() || Date.now() - lastFailureAt < RETRY_AFTER_FAILURE)) {
    return allPostsCache
  }

  // Параллельные запросы при пустом кеше ждут одну загрузку, а не запускают по своей
  pendingFetch ??= loadAllPosts().finally(() => {
    pendingFetch = null
  })

  return pendingFetch
}

async function loadAllPosts() {
  const allPosts = []
  let page = 1
  const limit = 50 // Запрашиваем больше за раз для эффективности
  let hasMore = true
  let username = null

  while (hasMore && page <= 10) { // Максимум 10 страниц = 500 постов
    const offset = (page - 1) * limit
    const url = `${BASE_URL_API}?key=${encodeURIComponent(VR9_API_KEY)}&username=${encodeURIComponent(LINKEDIN_USER_NAME)}&limit=${limit}&offset=${offset}`

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
      console.error(`[POSTS CACHE] Error fetching page ${page}:`, redact(error?.message))
      break
    }
  }

  // Если API не ответил, оставляем то, что уже было (иначе раздел постов опустеет),
  // а следующую попытку откладываем
  if (!allPosts.length) {
    lastFailureAt = Date.now()
    if (allPostsCache.data.length) allPostsCache.timestamp = Date.now()
    return allPostsCache
  }

  allPostsCache = {
    data: allPosts,
    timestamp: Date.now(),
    username,
  }

  return allPostsCache
}
