/**
 * Структурированные данные JSON-LD для поисковиков: сайт, автор, хлебные крошки, проект, коллекция.
 * Разметка сама добавляется в <head> страницы и обновляется вместе с данными.
 *
 * Адреса в additionalData — пути сайта; префикс языка добавляется, если его нет.
 */
export function useStructuredData(type = 'website', additionalData = {}) {
  const { locale, localeCodes } = useI18n()
  const route = useRoute()
  const localePath = useLocalePath()
  const siteMeta = useSiteMeta()
  const { mediaUrl } = useMedia()
  const absoluteUrl = useAbsoluteUrl()

  const currentUrl = computed(() => absoluteUrl(route.path))
  const localeUrl = (path) => {
    if (!path) return currentUrl.value
    if (/^https?:\/\//.test(path)) return path
    const hasLocale = localeCodes.value.some(code => path === `/${code}` || path.startsWith(`/${code}/`))
    return absoluteUrl(hasLocale ? path : (localePath(path) || path))
  }

  const homeUrl = computed(() => localeUrl('/'))
  const siteName = useSiteName()

  // WebSite
  const websiteSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName.value,
    url: homeUrl.value,
    description: siteMeta.value.description,
    inLanguage: locale.value,
  }))

  const authorName = computed(() => `${siteMeta.value.firstName || ''} ${siteMeta.value.lastName || ''}`.trim())
  const authorImage = computed(() => mediaUrl(siteMeta.value.image) || undefined)

  // Person
  const personSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName.value,
    jobTitle: siteMeta.value.specialization,
    description: siteMeta.value.description,
    url: homeUrl.value,
    image: authorImage.value,
    sameAs: unref(additionalData.sameAs)?.length ? unref(additionalData.sameAs) : undefined,
  }))

  // Organization (optional)
  const organizationSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName.value,
    url: homeUrl.value,
    logo: authorImage.value,
  }))

  // BreadcrumbList — для Google обязательны name или item.name в каждом itemListElement
  const breadcrumbSchema = computed(() => {
    const breadcrumbs = unref(additionalData.breadcrumbs)
    if (!breadcrumbs || !Array.isArray(breadcrumbs)) {
      return null
    }

    const items = breadcrumbs.map((crumb, index) => {
      const url = crumb.url ? localeUrl(crumb.url) : currentUrl.value
      const name = (crumb.name && String(crumb.name).trim()) ? String(crumb.name).trim() : (crumb.url || `Item ${index + 1}`)
      return {
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: {
          '@type': 'WebPage',
          '@id': url,
          name,
          url,
        },
      }
    })

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    }
  })

  // Project (CreativeWork)
  const projectSchema = computed(() => {
    if (type !== 'project') {
      return null
    }

    const project = unref(additionalData.project)
    if (!project || !project.title) {
      return null
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.subtitle || project.meta?.description || siteMeta.value.description,
      url: currentUrl.value,
      image: mediaUrl(project.preview_social?.url || project.preview?.formats?.medium?.url) || undefined,
      datePublished: project.time?.start || project.createdAt,
      dateModified: project.time?.end || project.updatedAt,
      author: {
        '@type': 'Person',
        name: authorName.value,
      },
      inLanguage: locale.value,
    }
  })

  // Collection (CollectionPage)
  const collectionSchema = computed(() => {
    if (type !== 'collection') {
      return null
    }

    const collection = unref(additionalData.collection)
    if (!collection) {
      return null
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: collection.title || collection.name,
      description: collection.description,
      url: currentUrl.value,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: collection.items?.length || 0,
        itemListElement: (collection.items || []).slice(0, 10).map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: item.title || item.name,
            url: item.url ? localeUrl(item.url) : undefined,
          },
        })),
      },
    }
  })

  const getStructuredData = computed(() => {
    const schemas = []

    schemas.push(websiteSchema.value)

    if (type === 'home') {
      schemas.push(personSchema.value)
    }

    if (additionalData.includeOrganization) {
      schemas.push(organizationSchema.value)
    }

    const breadcrumb = breadcrumbSchema.value
    if (breadcrumb) {
      schemas.push(breadcrumb)
    }

    const project = projectSchema.value
    if (project) {
      schemas.push(project)
    }

    const collection = collectionSchema.value
    if (collection) {
      schemas.push(collection)
    }

    return schemas.filter(Boolean)
  })

  useJsonLd(getStructuredData)
}

/**
 * Добавляет JSON-LD в <head> страницы. schemas — схема или массив схем (ref или геттер);
 * пустые значения пропускаются, разметка обновляется вместе с данными.
 */
export function useJsonLd (schemas, key = 'structured-data') {
  useHead({
    script: () => [toValue(schemas)].flat().filter(Boolean).map((schema, index) => ({
      key: `${key}-${index}`,
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema),
    })),
  })
}
