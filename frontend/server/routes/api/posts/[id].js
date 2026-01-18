// https://vr9.pro/api/services/linkedin/posts

import { fetchAllPosts, clearPostsCache, getPostById, isCacheValid } from '~/server/utils/postsCache'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  
  const postId = getRouterParam(event, 'id')
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required',
    })
  }

  const query = getQuery(event)
  const shouldUpdate = query.update === 'true' || query.update === true

  if (shouldUpdate) {
    clearPostsCache()
  }

  try {
    // Загружаем все посты (из кеша или с API)
    await fetchAllPosts(shouldUpdate)
    
    // Ищем пост по ID
    const post = getPostById(postId)
    
    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found',
      })
    }

    const result = {
      data: post,
      fromCache: isCacheValid() && !shouldUpdate,
    }

    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return result
  }
  catch (error) {
    if (error.statusCode === 404) {
      throw error
    }
    console.error(`[POSTS API] Error:`, error?.message || error)
    throw createError({
      statusCode: error?.status || error?.statusCode || 500,
      statusMessage: error?.data?.message || error?.message || 'Failed to fetch post',
    })
  }
})
