import { useMetaStore } from '~/stores/metaStore'

export function metaInfo(info = {}) {
  const { t, locale, locales } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()
  const metaStore = useMetaStore()
  const defMeta = metaStore.getMetaInfo
  const apiUrl = config.public.strapi.url
  const baseUrl = config.public.baseURL

  const type = 'website'
  const twcard = 'summary_large_image'
  const author = ref(defMeta.author)
  const siteName = computed(() => t('app.name') || defMeta.title || 'Portfolio')
  const lang = computed(() => locale.value)
  const currentUrl = computed(() => {
    const path = route.path
    const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/')
    return `${baseUrl}${cleanPath}`
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

  const hreflangLinks = computed(() => {
    const links = []
    const currentPath = route.path.replace(/^\/[a-z]{2}(\/|$)/, '/')
    
    locales.value.forEach((loc) => {
      const localeCode = typeof loc === 'string' ? loc : loc.code
      const isoCode = typeof loc === 'object' && loc.iso ? loc.iso : localeCode
      const path = localeCode === 'en' ? currentPath : `/${localeCode}${currentPath}`
      const url = `${baseUrl}${path}`
      
      links.push({
        rel: 'alternate',
        hreflang: localeCode,
        href: url,
      })

      if (localeCode === 'en') {
        links.push({
          rel: 'alternate',
          hreflang: 'x-default',
          href: url,
        })
      }
    })
    
    return links
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
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      
      // Open Graph
      { property: 'og:type', content: type },
      { property: 'og:url', content: currentUrl.value },
      { property: 'og:title', content: title.value },
      { property: 'og:description', content: description.value },
      { property: 'og:image', content: image.value },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title.value },
      { property: 'og:locale', content: lang.value },
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
      lang: lang.value,
    },
  }))
}
