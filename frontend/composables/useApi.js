import qs from 'qs'
import { useLoadingStore } from '~/stores/loadingStore'

export function serverFetch (name, params = {}, defaultValue = {}, fetchType = 'find') {
  const nuxtApp = useNuxtApp()
  const result = ref(defaultValue)
  const key = `${name}-${JSON.stringify(params)}`

  let slug = null
  if (params?.slug) {
    slug = params.slug
    delete params.slug
  }

  const methods = {
    find: () => find(name, params),
    findBySlug: () => findBySlug(name, slug, params),
  }
  const fetchFunction = methods[fetchType]
  useAsyncData(key, fetchFunction, {
    // getCachedData: key => nuxtApp.payload?.static?.[key] ?? nuxtApp.payload?.data?.[key],
  })
    .then(({ data }) => {
      result.value = data.value?.data
    })

  return result
}


export function urlFile (urlFile) {
  const config = useRuntimeConfig()
  const urlApi = config.public.strapi.url
  return `${urlApi}${urlFile}`
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
  const { find } = useStrapi()
  return sendRequest({ name, params }, async (query) => {
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
  return sendRequest({ name, params: modParams }, async (query) => {
    const { find } = useStrapi()
    const result = await find(query)
    return { ...result, data: result.data[0] }
  })
}

export async function findOne (name, params = {}) {
  return sendRequest({ name, params }, async (query) => {
    const { findOne } = useStrapi()
    return await findOne(query)
  })
}

async function sendRequest ({ name, params }, cb) {
  let result = {
    data: null,
    meta: null,
    status: false,
  }
  const { $i18n } = useNuxtApp()
  const { iso } = $i18n.localeProperties.value

  const query = qs.stringify({
    locale: toSimpleLocale(iso),
    populate: 'deep',
    ...params,
  }, { encodeValuesOnly: true })

  try {
    requestStart()
    const { data, meta } = await cb(`${name}?${query}`)
    requestFinally()

    if (data) {
      result.data = data
      result.meta = meta
      result.status = true
    }
  }
  catch (error) {
    requestFinally()
    console.error('Error api asyncData:', error)
    // throw showError({ statusCode: error.code, statusMessage: error.message })
  }

  return result
}

function requestStart () {
  if (process.client) {
    const loadingStore = useLoadingStore()
    loadingStore.updateLoading(true)
  }
}
function requestFinally () {
  if (process.client) {
    const loadingStore = useLoadingStore()
    loadingStore.updateLoading(false)
  }
}

function toSimpleLocale (locale) {
  return locale.split('-').shift()
}
