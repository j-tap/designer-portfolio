// https://vr9.pro/api/services/linkedin/posts

import { fetchAllPosts, canForceUpdate, isCacheValid } from '~/server/utils/postsCache'

const POSTS_PER_PAGE = 15

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  
  const query = getQuery(event)
  const shouldUpdate = canForceUpdate(query)
  const page = Math.max(1, parseInt(query.page) || 1)

  try {
    // Загружаем все посты (из кеша или с API)
    const cache = await fetchAllPosts(shouldUpdate)
    const allPosts = cache.data

    // Пагинация на стороне сервера
    const start = (page - 1) * POSTS_PER_PAGE
    const end = start + POSTS_PER_PAGE
    const posts = allPosts.slice(start, end)
    const hasMore = end < allPosts.length

    const result = {
      data: posts,
      page,
      hasMore,
      total: allPosts.length,
      username: cache.username,
      fromCache: isCacheValid() && !shouldUpdate,
    }

    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return result
  }
  catch (error) {
    console.error(`[POSTS API] Error:`, error?.message || error)
    throw createError({
      statusCode: error?.status || error?.statusCode || 500,
      statusMessage: error?.data?.message || error?.message || 'Failed to fetch posts',
    })
  }
})
