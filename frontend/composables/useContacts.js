/**
 * Ссылки из Strapi (одиночный тип «Контакты»). display — где показывать ссылку
 * (поле multi-select: contacts, card, …); без него — все.
 */
export function useContacts (display = null) {
  const { data } = useStrapiData('contact')
  return computed(() => (data.value?.contact || []).filter(item => !display || item.display?.includes(display)))
}
