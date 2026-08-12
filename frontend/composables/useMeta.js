import { useMetaStore } from '~/stores/metaStore'
import i18nConfig, { defaultLocale } from '~/config/i18n'

// og:locale ждёт формат ru_RU, а useI18n().locales отдаёт только коды
const localeIsoMap = i18nConfig.locales.reduce((acc, loc) => {
  acc[loc.code] = (loc.iso || loc.code).replace('-', '_')
  return acc
}, {})

export function normalizeUrlPath (path) {
  if (!path) return '/'
  const [pathname, query] = String(path).split('?')
  const clean = pathname.replace(/\/+$/, '') || '/'
  return query ? `${clean}?${query}` : clean
}

export function metaInfo(info = {}) {
  const { t, locale, locales } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()
  const metaStore = useMetaStore()
  const switchLocalePath = useSwitchLocalePath()
  const defMeta = metaStore.getMetaInfo
  const apiUrl = config.public.strapi.url
  const baseUrl = config.public.baseURL

  const twcard = 'summary_large_image'
  const author = ref(defMeta.author)
  const siteName = computed(() => t('app.name') || defMeta.title || 'Portfolio')
  const type = computed(() => unref(info.type) || 'website')
  const localeIso = computed(() => localeIsoMap[locale.value] || locale.value)
  // Каноническая ссылка всегда указывает на текущую локализованную страницу:
  // путь уже содержит префикс локали (стратегия i18n — prefix)
  const currentUrl = computed(() => {
    const path = unref(info.canonical) || route.path
    return `${baseUrl}${normalizeUrlPath(path)}`
  })

  const title = computed(() => {
    let tl = info.title?.value || defMeta.title || t('app.name')
    if (route.name !== 'index') {
      tl += ` | ${siteName.value}`
    }
    return tl
  })

  const image = computed(() => {
    let img = info.image?.value || defMeta.image || '/og-image.png'
    if (info.image?.value) {
      if (img.startsWith('/uploads/') || img.startsWith('/api/')) {
        img = `${apiUrl}${img}`
      } else if (!img.startsWith('http')) {
        img = `${baseUrl}${img}`
      }
    } else {
      img = `${baseUrl}${img}`
    }
    return img
  })

  const description = computed(() => {
    const desc = info.description?.value || defMeta.description
    if (desc && desc.length > 160) {
      return desc.substring(0, 157) + '...'
    }
    return desc
  })

  const keywords = computed(() => info.keywords?.value || defMeta.keywords)

  // Ссылки на языковые версии текущего маршрута (с префиксом локали)
  const localeAlternates = computed(() => {
    return locales.value.reduce((acc, loc) => {
      const code = typeof loc === 'string' ? loc : loc.code
      const path = switchLocalePath(code)

      if (path) {
        acc.push({ code, iso: localeIsoMap[code] || code, url: `${baseUrl}${normalizeUrlPath(path)}` })
      }
      return acc
    }, [])
  })

  const hreflangLinks = computed(() => {
    const links = []

    localeAlternates.value.forEach(({ code, url }) => {
      links.push({
        rel: 'alternate',
        hreflang: code,
        href: url,
      })

      if (code === defaultLocale) {
        links.push({
          rel: 'alternate',
          hreflang: 'x-default',
          href: url,
        })
      }
    })

    return links
  })

  const localeAlternateMeta = computed(() => {
    return localeAlternates.value
      .filter(({ code }) => code !== locale.value)
      .map(({ iso }) => ({ property: 'og:locale:alternate', content: iso }))
  })

  return computed(() => ({
    title: title.value,
    link: [
      { rel: 'canonical', href: currentUrl.value },
      { rel: 'image_src', href: image.value },
      ...hreflangLinks.value,
    ],
    meta: [
      { name: 'description', content: description.value },
      { name: 'keywords', content: keywords.value },
      { name: 'author', content: author.value },
      { name: 'robots', content: info.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },

      // Open Graph
      { property: 'og:type', content: type.value },
      { property: 'og:url', content: currentUrl.value },
      { property: 'og:title', content: title.value },
      { property: 'og:description', content: description.value },
      { property: 'og:image', content: image.value },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title.value },
      { property: 'og:locale', content: localeIso.value },
      ...localeAlternateMeta.value,
      { property: 'og:site_name', content: siteName.value },

      // Twitter Card
      { name: 'twitter:card', content: twcard },
      { name: 'twitter:url', content: currentUrl.value },
      { name: 'twitter:title', content: title.value },
      { name: 'twitter:description', content: description.value },
      { name: 'twitter:image', content: image.value },
      { name: 'twitter:image:alt', content: title.value },
    ],
    bodyAttrs: {
      class: '',
    },
    htmlAttrs: {
      lang: locale.value,
    },
  }))
}
