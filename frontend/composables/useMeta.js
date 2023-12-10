import { useMetaStore } from '~/stores/metaStore'

export function metaInfo(info = {}) {
  const { t, locale } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()
  const metaStore = useMetaStore()
  const defMeta = metaStore.getMetaInfo
  const apiUrl = config.public.strapi.url
  const baseUrl = config.public.baseURL

  const type = 'website'
  const twcard = 'summary_large_image'
  const author = ref(defMeta.author)
  const lang = computed(() => locale.value)
  const currentUrl = computed(() => `${baseUrl}${route.path}`)
  const title = computed(() => {
    let tl = info.title?.value || defMeta.title || t('app.name')
    if (route.name !== 'index') {
      tl += ` | ${t('app.name')}`
    }
    return tl
  })
  const image = computed(() => {
    let img = info.image?.value || defMeta.image || '/_nuxt/og-image.png'
    if (info.image) {
      img = `${apiUrl}${img}`
    }
    else {
      img = `${baseUrl}${img}`
    }
    return img
  })
  const description = computed(() => info.description?.value || defMeta.description)
  const keywords = computed(() => info.keywords?.value || defMeta.keywords)

  return computed(() => ({
    title: title.value,
    link: [
      { rel: 'image_src', href: image.value },
      { rel: 'canonical', href: baseUrl },
    ],
    meta: [
      { name: 'title', content: title.value },
      { name: 'description', content: description.value },
      { name: 'keywords', content: keywords.value },
      { name: 'author', content: author.value },
      { property: 'og:type', content: type },
      { property: 'og:url', content: currentUrl },
      { property: 'og:title', content: title.value },
      { property: 'og:image', content: image.value },
      { property: 'og:image:width', content: '500' },
      { property: 'og:image:height', content: '500' },
      { property: 'og:locale', content: lang.value },
      { property: 'twitter:card', content: twcard },
      { property: 'twitter:url', content: currentUrl },
      { property: 'twitter:title', content: title.value },
      { property: 'twitter:description', content: description.value },
      { property: 'twitter:image', content: image.value },
    ],
    bodyAttrs: {
      class: '',
    },
    htmlAttrs: {
      lang: lang.value,
    },
  }))
}
