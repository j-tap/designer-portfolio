/**
 * Открыто ли окно с формой связи на посадочной странице. Окно одно на страницу, а открывают
 * его несколько кнопок: в первом экране, посреди страницы и в блоке контактов
 * @returns {import('vue').Ref<boolean>}
 */
export function useContactFormOpen () {
  return useState('contact-form-open', () => false)
}
