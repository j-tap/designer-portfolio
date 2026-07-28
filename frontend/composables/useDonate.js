import { serverFetch } from '~/composables/useApi'

export function getDonateOptions () {
  const data = serverFetch('donate-options', {
    sort: [{ order: 'asc' }],
  }, [])
  return computed(() => data.value)
}
