const cache = {
  data: null,
  timestamp: null,
}

const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 часа
const LINKEDIN_USER_URN = process.env.LINKEDIN_USER_URN
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  
  const now = Date.now()
  const query = getQuery(event)
  const shouldUpdate = query.update === 'true' || query.update === true
  const isCacheValid = cache.data && cache.timestamp && (now - cache.timestamp) < CACHE_TTL

  if (isCacheValid && !shouldUpdate) {
    setHeader(event, 'Cache-Control', 'public, max-age=86400')

    const cachedResponse = typeof cache.data === 'object' && cache.data !== null
      ? { ...cache.data, fromCache: true }
      : { data: cache.data, fromCache: true }
    return cachedResponse
  }

  try {
    const response = await $fetch(`https://fresh-linkedin-scraper-api.p.rapidapi.com/api/v1/user/posts?urn=${LINKEDIN_USER_URN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'fresh-linkedin-scraper-api.p.rapidapi.com',
      },
    })

    cache.data = response
    cache.timestamp = now

    setHeader(event, 'Cache-Control', 'public, max-age=86400')

    const freshResponse = typeof response === 'object' && response !== null
      ? { ...response, fromCache: false }
      : { data: response, fromCache: false }
    return freshResponse
  }
  catch (error) {
    throw createError({
      statusCode: error?.status || error?.statusCode || 500,
      statusMessage: error?.data?.message || error?.message || 'Failed',
    })
  }
})
