import { safeUrl } from '~/utils/url'

/**
 * Ссылка на WhatsApp из «Контактов» в Strapi (wa.me) с заготовленным текстом сообщения
 * @param {import('vue').MaybeRefOrGetter<string|undefined>} message
 * @returns {import('vue').ComputedRef<string|undefined>}
 */
export function useWhatsappLink (message) {
  const contacts = useContacts()

  return computed(() => {
    const link = safeUrl(contacts.value.find(item => /wa\.me|whatsapp/i.test(item.link || ''))?.link)
    const text = toValue(message)
    if (!link || !text) return link
    try {
      const url = new URL(link)
      url.searchParams.set('text', text)
      return url.toString()
    }
    catch {
      return link
    }
  })
}
