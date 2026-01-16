import { serverFetch } from '~/composables/useApi'

export const pageTypes = {
  default: 'default',
  other: 'other',
  mobile: 'mobile',
}
export function getPagesByType (list = [], type = pageTypes.default) {
  return list.filter(o => o.type === type)
}

export function getMoreProjects (filters) {
  const moreProjects = serverFetch('projects', {
    filters,
    pagination: { pageSize: 15 },
  }, [])
  return computed(() => {
    if (!moreProjects.value?.length) return []
    const shuffled = [...moreProjects.value]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  })
}

export function getProjectData (slug, categorySlug, filters) {
  const data = serverFetch('projects', {
    slug: slug.value,
    filters,
  }, {}, 'findBySlug')
  return computed(() => {
    const result = { ...data.value }
    if (result?.pages) {
      result.pages = result.pages.filter(o => o.active !== false)
    }
    return result
  })
}

export function getProjectMeta (project, categorySlug) {
  const title = computed(() => `${project.value?.title} / ${project.value?.categories?.find(o => o.slug === categorySlug.value)?.title}`);
  const description = computed(() => project.value?.meta?.description || project.value?.subtitle);
  const img = computed(() => project.value?.preview_social?.url ||
    project.value?.preview?.formats.medium.url ||
    project.value?.pages?.[0]?.images?.[0]?.formats?.medium?.url);
  const keywords = computed(() => project.value?.meta?.keywords);

  return {
    title,
    description,
    img,
    keywords,
  }
}
