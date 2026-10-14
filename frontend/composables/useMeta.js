const DESCRIPTION_MAX = 160
const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

/**
 * Абсолютные адреса страниц сайта (для JSON-LD и соцсетей). Путь — уже с префиксом языка.
 * Вызывается в setup, как useMedia().
 */
export function useAbsoluteUrl () {
  const base = useRuntimeConfig().public.siteUrl

  return (path = '/') => {
    const [pathname, query] = String(path).split('?')
    const clean = pathname.replace(/\/+$/, '') || '/'
    return `${base}${clean}${query ? `?${query}` : ''}`
  }
}

/**
 * Заголовок, описание, картинка и разметка для соцсетей (Open Graph, Twitter) страницы.
 * Значения — строки, ref или геттеры; незаданные берутся из мета-информации сайта.
 * canonical, hreflang, og:url и og:locale для всех страниц ставит app.vue (useLocaleHead).
 */
export function usePageMeta (info = {}) {
  const { t } = useI18n()
  const route = useRoute()
  const getRouteBaseName = useRouteBaseName()
  const siteMeta = useSiteMeta()
  const { mediaUrl } = useMedia()
  const absoluteUrl = useAbsoluteUrl()

  const siteName = computed(() => t('app.name') || siteMeta.value.title || 'Portfolio')

  // На главной — только заголовок сайта, на остальных — «Страница | Сайт»
  const title = computed(() => {
    const own = toValue(info.title) || siteMeta.value.title || t('app.name')
    return getRouteBaseName(route) === 'index' ? own : `${own} | ${siteName.value}`
  })

  const description = computed(() => {
    const text = toValue(info.description) || siteMeta.value.description
    return text?.length > DESCRIPTION_MAX ? `${text.slice(0, DESCRIPTION_MAX - 3)}...` : text
  })

  // Картинка страницы и картинка сайта лежат в медиатеке Strapi, запасная — в public сайта
  const image = computed(() => {
    const own = toValue(info.image) || siteMeta.value.image
    return own ? mediaUrl(own) : absoluteUrl('/og-image.png')
  })

  useSeoMeta({
    title,
    description,
    keywords: () => toValue(info.keywords) || siteMeta.value.keywords,
    author: () => siteMeta.value.author,
    robots: () => (toValue(info.noindex) ? 'noindex, nofollow' : ROBOTS_INDEX),

    ogType: () => toValue(info.type) || 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: title,
    ogSiteName: siteName,

    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: title,
  })

  useHead({
    link: [{ rel: 'image_src', href: image }],
  })
}
