/**
 * Показан ли сейчас баннер cookie: плавающие кнопки внизу экрана прячутся, чтобы его не перекрывать
 * @returns {import('vue').Ref<boolean>}
 */
export function useCookieBannerOpen () {
  return useState('cookie-banner-open', () => false)
}
