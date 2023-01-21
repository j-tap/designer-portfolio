export function setMeta ({ title, description, image }) {
  const { meta } = useRoute()

  meta.title = title
  meta.description = description
  meta.image = image
}

export function setHead () {
  const { t } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()

  const title = computed(() => {
    const isTitle = route.meta.title
    let result = route.meta.title

    if (!isTitle) {
      result = t('app.name')
    }
    if (route.name !== 'index' && isTitle) {
      result = `${result} | ${t('app.name')}`
    }
    return result
  })
  const description = computed(() => route.meta.description)
  const image = computed(() => route.meta.image || `${config.public.baseURL}/_nuxt/og-image.png`)
  // console.log(image.value)
  useHead({
    title,
    link: [
      { rel: 'image_src', href: image },
    ],
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:image', content: image },
    ],
    bodyAttrs: {
      class: '',
    },
  })
}