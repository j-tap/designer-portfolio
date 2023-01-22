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

  let title = info.title || defMeta.title || t('app.name')
  if (route.name !== 'index') {
    title = `${title} | ${t('app.name')}`
  }

  const url = config.public.baseURL || defMeta.image
  const description = info.description || defMeta.description
  const keywords = info.keywords || defMeta.keywords
  const author = defMeta.author
  const image = `${apiUrl}${info.image}` || `${url}${defMeta.image}` || `${url}/_nuxt/og-image.png`
  const lang = locale.value

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