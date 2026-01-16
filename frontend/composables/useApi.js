import qs from 'qs'
import { useLoadingStore } from '~/stores/loadingStore'

export function serverFetch (name, params = {}, defaultValue = [], fetchType = 'find') {
  const nuxtApp = useNuxtApp()
  const key = `${name}-${JSON.stringify(params)}`
  let slug = null

  if (params?.slug) {
    slug = params.slug
    delete params.slug
  }

  const methods = {
    find: () => find(name, params),
    findBySlug: () => findBySlug(name, slug, params),
    findOne: () => findOne(name, params),
  }

  const result = ref(defaultValue)

  useAsyncData(key, methods[fetchType], {
    server: true,
    default: () => defaultValue,
    getCachedData: key => nuxtApp.payload?.static?.[key] ?? nuxtApp.payload?.data?.[key],
  })
    .then(({ data }) => {
      if (data.value?.data !== undefined) {
        result.value = data.value.data
      }
    })

  return result
}

export async function serverCreate (name, data = {}) {
  try {
    return await create(name, data)
  }
  catch (error) {
    console.error('Error api serverCreate:', error)
  }
}

export function urlFile (urlFile) {
  const config = useRuntimeConfig()
  return `${config.public.strapi.url}${urlFile}`
}

export function getFormatImages (item) {
  return {
    blurhash: item.blurhash,
    url: urlFile(item.url),
    id: item.id,
    title: item.name,
    width: item.width,
    height: item.height,
  }
}

export async function find (name, params = {}) {
  return sendRequest(name, params, 'get', async (query) => {
    const { find } = useStrapi()
    return await find(query)
  })
}

export async function findBySlug (name, slug, params = {}) {
  const modParams = {
    ...params,
    filters: {
      ...params.filters,
      slug: { $eq: slug },
    },
  }
  return sendRequest(name, modParams, 'get', async (query) => {
    const { find } = useStrapi()
    const result = await find(query)
    return { ...result, data: result.data[0] }
  })
}

export async function findOne (name, params = {}) {
  return sendRequest(name, params, 'get', async (query) => {
    const { findOne } = useStrapi()
    return await findOne(query)
  })
}

export async function create (name, body) {
  const config = useRuntimeConfig()
  return await fetch(`${config.public.strapi.url}/api/${name}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

async function sendRequest (name, params, method, cb) {
  let locale = null

  try {
    const i18n = useI18n()
    locale = i18n?.locale?.value
  }
  catch (error) {}

  const query = method === 'get' ? qs.stringify({
    locale: toSimpleLocale(locale),
    populate: 'deep',
    ...params,
  }, { encodeValuesOnly: true }) : ''

  const result = {
    data: null,
    meta: null,
    status: false,
  }

  try {
    updateLoading(true)
    const url = `${name}${query ? `?${query}` : ''}`
    const resp = method === 'get' ? await cb(url) : await cb(url, params)

    result.data = resp?.data || resp
    result.meta = resp?.meta
    result.status = true
  }
  catch (error) {
    console.error('Error api asyncData:', error)
  }
  finally {
    updateLoading(false)
  }

  return result
}

function updateLoading (isLoading) {
  if (process.client) {
    const loadingStore = useLoadingStore()
    loadingStore.updateLoading(isLoading)
  }
}

function toSimpleLocale (locale) {
  if (!locale) return null
  return locale.split('-')[0]
}
