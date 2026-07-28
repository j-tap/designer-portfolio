import { serverFetch } from '~/composables/useApi'

export function getDonateData () {
  const data = serverFetch('donate', {}, {})
  return computed(() => data.value)
}

export function getDonateOptions () {
  const data = serverFetch('donate-options', {
    sort: [{ order: 'asc' }],
  }, [])
  return computed(() => data.value)
}
