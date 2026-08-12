import { useMetaStore } from '~/stores/metaStore'
import { normalizeUrlPath } from '~/composables/useMeta'

/**
 * Генерирует структурированные данные JSON-LD для SEO
 */
export function useStructuredData(type = 'website', additionalData = {}) {
  const { t, locale, locales } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()
  const metaStore = useMetaStore()
  const localePath = useLocalePath()
  const defMeta = metaStore.getMetaInfo
  const baseUrl = config.public.baseURL

  // Все адреса в разметке — реально существующие, с префиксом локали
  const currentUrl = computed(() => `${baseUrl}${normalizeUrlPath(route.path)}`)
  const localeCodes = computed(() => locales.value.map(loc => (typeof loc === 'string' ? loc : loc.code)))

  const localeUrl = (path) => {
    if (!path) return currentUrl.value
    if (/^https?:\/\//.test(path)) return path

    const hasLocalePrefix = localeCodes.value.some(code => path === `/${code}` || path.startsWith(`/${code}/`))
    const localized = hasLocalePrefix ? path : (localePath(path) || path)
    return `${baseUrl}${normalizeUrlPath(localized)}`
  }

  const homeUrl = computed(() => localeUrl('/'))

  const siteName = computed(() => t('app.name') || defMeta.title || 'Portfolio')

  // WebSite
  const websiteSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName.value,
    url: homeUrl.value,
    description: defMeta.description,
    inLanguage: locale.value,
  }))

  // Person
  const personSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${defMeta.first_name || ''} ${defMeta.last_name || ''}`.trim(),
    jobTitle: defMeta.specialization,
    description: defMeta.description,
    url: homeUrl.value,
    image: defMeta.image ? `${config.public.strapi.url}${defMeta.image}` : undefined,
    sameAs: unref(additionalData.sameAs)?.length ? unref(additionalData.sameAs) : undefined,
  }))

  // Organization (optional)
  const organizationSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName.value,
    url: homeUrl.value,
    logo: defMeta.image ? `${config.public.strapi.url}${defMeta.image}` : undefined,
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

    const apiUrl = config.public.strapi.url

    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.subtitle || project.meta?.description || defMeta.description,
      url: currentUrl.value,
      image: project.preview_social?.url
        ? `${apiUrl}${project.preview_social.url}`
        : project.preview?.formats?.medium?.url
          ? `${apiUrl}${project.preview.formats.medium.url}`
          : undefined,
      datePublished: project.time?.start || project.createdAt,
      dateModified: project.time?.end || project.updatedAt,
      author: {
        '@type': 'Person',
        name: `${defMeta.first_name || ''} ${defMeta.last_name || ''}`.trim(),
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

    if (type === 'home' || route.name === 'index') {
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

  return {
    getStructuredData,
    websiteSchema,
    personSchema,
    organizationSchema,
    breadcrumbSchema,
    projectSchema,
    collectionSchema,
  }
}
