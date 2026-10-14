// Типы страниц проекта (поле type у страницы в Strapi): от них зависит раскладка
export const pageTypes = {
  default: 'default',
  other: 'other',
  mobile: 'mobile',
}

export function getPagesByType (list = [], type = pageTypes.default) {
  return list.filter(page => page.type === type)
}
