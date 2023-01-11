export function setMeta ({ title, description }) {
  const { meta } = useRoute()

  meta.title = title
  meta.description = description
}

export function setHead () {
  const { t } = useI18n()
  const route = useRoute()

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

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
    ],
    bodyAttrs: {
      class: '',
    },
  })
}