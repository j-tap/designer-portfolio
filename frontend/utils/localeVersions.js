/**
 * Из ответа Strapi с locale=* (каждая запись — во всех своих языковых версиях) оставляет
 * по одной версии записи: ту, чей язык раньше в цепочке (contentLocales из config/i18n).
 * Порядок записей — порядок первой встреченной версии, то есть сортировка Strapi.
 *
 * Языки остальных версий записываются в localizations — так же, как их отдаёт populate=deep
 * для запроса на одном языке: по ним строятся hreflang и canonical (definePageLocales).
 * У непереводимых типов (отзывы) поля locale нет: такая запись одна и остаётся как есть.
 *
 * @param {Array<{ documentId: string, locale: string }>} rows
 * @param {string[]} chain
 * @return {Array}
 */
export function pickLocaleVersions (rows, chain) {
  const documents = new Map()

  for (const row of rows) {
    if (row.locale && !chain.includes(row.locale)) continue
    const versions = documents.get(row.documentId)
    if (versions) versions.push(row)
    else documents.set(row.documentId, [row])
  }

  return [...documents.values()].map((versions) => {
    const best = versions.reduce((a, b) => (chain.indexOf(b.locale) < chain.indexOf(a.locale) ? b : a))
    return {
      ...best,
      localizations: versions.filter(version => version !== best).map(({ locale }) => ({ locale })),
    }
  })
}
