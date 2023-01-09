export const pageTypes = {
  default: 'default',
  other: 'other',
  mobile: 'mobile',
}
export function getPagesByType (list = [], type = pageTypes.default) {
  return list.filter(o => o.type === type)
}