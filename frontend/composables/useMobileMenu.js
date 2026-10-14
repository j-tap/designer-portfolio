/**
 * Открыто ли мобильное меню: шапка его переключает, макет затемняет под ним страницу.
 */
export function useMobileMenu () {
  return useState('mobile-menu-open', () => false)
}
