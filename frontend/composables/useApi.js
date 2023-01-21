import qs from 'qs'
import { useLoadingStore } from '~/stores/loadingStore'

export function urlFile (urlFile) {
  const config = useRuntimeConfig()
  const urlApi = config.public.strapi.url
  return `${urlApi}${urlFile}`
}

export function getFormatImages (item) {
  return {
    blurhash: item.blurhash,
    url: item.formats.large.url,
    id: item.id,
    title: item.name,
    width: item.width,
    height: item.height,
  }
}

export async function find (name, params = {}) {
  return sendRequest({ name, params }, async (query) => {
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
  return sendRequest({ name, params: modParams }, async (query) => {
    const { find } = useStrapi()
    const result = await find(query)
    return { ...result, data: result.data[0] }
  })
}

export async function findOne (name, params = {}) {
  return sendRequest({ name, params }, async (query, params) => {
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
  const { locale } = useI18n()
  const query = qs.stringify({
    locale: locale.value,
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
  } catch (error) {
    requestFinally()
    console.error('Error api asyncData:', error)
    // throw showError({ statusCode: error.code, statusMessage: error.message })
  }

  return result
}

function requestStart () {
  const loadingStore = useLoadingStore()
  loadingStore.updateLoading(true)
}
function requestFinally () {
  const loadingStore = useLoadingStore()
  loadingStore.updateLoading(false)
}