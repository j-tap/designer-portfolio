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

// rank в Strapi — строка: сравниваем как числа, иначе «10» окажется раньше «2»
export function sortByRank (list = []) {
  return [...list].sort((a, b) => a.rank - b.rank)
}
