import { serverFetch } from '~/composables/useApi'

export function getDonateData () {
  const data = serverFetch('donate', {}, {})
  return computed(() => data.value)
}
