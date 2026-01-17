// https://rapidapi.com/saleleadsdotai-saleleadsdotai-default/api/fresh-linkedin-scraper-api/playground/apiendpoint_ebd23516-20cf-409c-9e32-1a8d4c3003e7

const pageCache = new Map()
const pageTokens = new Map()
const CACHE_TTL = 24 * 60 * 60 * 1000
const LINKEDIN_USER_URN = process.env.LINKEDIN_USER_URN
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const BASE_URL_API = 'https://fresh-linkedin-scraper-api.p.rapidapi.com/api/v1/user/posts'
const API_HOST = 'fresh-linkedin-scraper-api.p.rapidapi.com'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  
  const now = Date.now()
  const query = getQuery(event)
  const shouldUpdate = query.update === 'true' || query.update === true
  const page = Math.max(1, parseInt(query.page) || 1)

  if (shouldUpdate) {
    pageCache.clear()
    pageTokens.clear()
  }

  const cached = pageCache.get(page)
  if (cached && (now - cached.timestamp) < CACHE_TTL && !shouldUpdate) {
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return { ...cached.data, fromCache: true }
  }

  try {
    if (page > 1 && !pageTokens.has(page)) {
      for (let p = 1; p < page; p++) {
        if (!pageTokens.has(p + 1)) {
          const token = p === 1 ? null : pageTokens.get(p)
          const result = await fetchFromApi(token)
          if (result.pagination_token) {
            pageTokens.set(p + 1, result.pagination_token)
          } else {
            return { data: [], page, hasMore: false, fromCache: false }
          }
        }
      }
    }

    const token = page === 1 ? null : pageTokens.get(page)
    const response = await fetchFromApi(token)
    
    const posts = response.data || []
    const hasMore = posts.length > 0 && !!response.pagination_token

    if (response.pagination_token) {
      pageTokens.set(page + 1, response.pagination_token)
    }

    const result = {
      data: posts,
      page,
      hasMore,
      fromCache: false,
    }

    pageCache.set(page, { data: result, timestamp: now })
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

async function fetchFromApi(paginationToken) {
  let url = `${BASE_URL_API}?urn=${LINKEDIN_USER_URN}`
  if (paginationToken) {
    url += `&pagination_token=${encodeURIComponent(paginationToken)}`
  }

  const response = await $fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': API_HOST,
    },
  })

  return {
    data: response?.data || [],
    pagination_token: response?.pagination_token || null,
  }
}
