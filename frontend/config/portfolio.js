// Категории и подкатегории, где у работ нет отдельных страниц: в списке только превью без ссылки,
// в карте сайта нет ни страниц этих проектов, ни страницы самой категории
export const listOnly = {
  categories: ['identity'],
  subcategories: ['logotipy'],
}

// Есть ли у работ списка свои страницы: в подкатегории решает подкатегория, иначе — категория
export function hasProjectPages ({ category, subcategory } = {}) {
  return subcategory
    ? !listOnly.subcategories.includes(subcategory)
    : !listOnly.categories.includes(category)
}

// Адрес в портфолио без префикса языка: /portfolio/<категория>[/<подкатегория>][/<проект>]
export function portfolioPath (...slugs) {
  return ['/portfolio', ...slugs.filter(Boolean)].join('/')
}

// Адрес страницы проекта из списка категории или подкатегории; null — у работ этого списка нет страниц
export function projectPath ({ category, subcategory = null }, slug) {
  return hasProjectPages({ category, subcategory }) ? portfolioPath(category, subcategory, slug) : null
}

// Все адреса страницы проекта: в подкатегориях — по адресам подкатегорий, иначе — по адресам категорий.
// Нужны categories.slug и subcategories.slug с subcategories.category.slug
export function projectPaths (project) {
  const places = project.subcategories?.length
    ? project.subcategories.map(subcategory => ({ category: subcategory.category?.slug, subcategory: subcategory.slug }))
    : (project.categories ?? []).map(category => ({ category: category.slug }))

  return places
    .filter(place => place.category)
    .map(place => projectPath(place, project.slug))
    .filter(Boolean)
}

// rank в Strapi — строка: сравниваем как числа, иначе «10» окажется раньше «2»
export function sortByRank (list = []) {
  return [...list].sort((a, b) => a.rank - b.rank)
}
