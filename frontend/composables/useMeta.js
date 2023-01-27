import { useMetaStore } from '~/stores/metaStore'

export function metaInfo (info = {
  title: null,
  description: null,
  keywords: null,
  image: null,
}) {
  const { locale } = useI18n()
  const { t } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()
  const metaStore = useMetaStore()
  const defMeta = metaStore.getMetaInfo
  const apiUrl = config.public.strapi.url
  const type = 'website'
  const twcard = 'summary_large_image'

  const url = config.public.baseURL
  const description = info.description || defMeta.description
  const keywords = info.keywords || defMeta.keywords
  const author = defMeta.author
  const lang = locale.value

  let title = info.title || defMeta.title || t('app.name')
  if (route.name !== 'index') {
    title = `${title} | ${t('app.name')}`
  }

  let image = `${apiUrl}/_nuxt/og-image.png`
  if (info.image) {
    image = `${apiUrl}${info.image}`
  } else if (defMeta.image) {
    image = `${apiUrl}${defMeta.image}`
  }

  return {
    title: title,
    link: [
      { rel: 'image_src', href: image },
    ],
    meta: [
      { name: 'title', content: title },
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: author },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '500' },
      { property: 'og:image:height', content: '500' },
      { property: 'og:locale', content: lang },
      { property: 'twitter:card', content: twcard },
      { property: 'twitter:url', content: url },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: image },
    ],
    bodyAttrs: {
      class: '',
    },
    htmlAttrs: {
      lang,
    },
  }
}