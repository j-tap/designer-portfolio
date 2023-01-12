import { useLoadingStore } from '~/stores/loadingStore'

export async function find (name) {
  let result = {
    data: null,
    meta: null,
    status: false,
  }
  const { locale } = useI18n()
  const query = `${name}?locale=${locale.value}&populate=*`
  const { find } = useStrapi()

  try {
    requestStart()
    const { data, meta } = await find(query)
    requestFinally()

    if (data) {
      result.data = formatApiResponse(data)
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

function formatApiResponse (data) {
  if (!data) {
    return undefined
  }
  if (Array.isArray(data)) {
    return data.reduce(
      (acc, curr) => {
        const item = {
          id: curr.id,
          ...curr.attributes,
        }
        acc.push(item)
        return acc
      },
      [],
    )
  }
  return {
    id: data.id,
    ...data.attributes,
  }
}