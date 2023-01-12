import { useLoadingStore } from '~/stores/loadingStore'

export async function find (name) {
  // const { locale } = useI18n()
  //   ?populate=*&locale=${locale.value}
  const query = `${name}?populate=*`
  const loadingStore = useLoadingStore()
  loadingStore.updateLoading(true)

  const { find } = useStrapi()

  const {data, error} = await useAsyncData(
    query,
    () => find(query),
  )

  loadingStore.updateLoading(false)

  if (error?.value) {
    console.error('Error api asyncData:', error.value)
  }
  if (data?.value) {
    return formatApiResponse(data.value.data)
  }
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