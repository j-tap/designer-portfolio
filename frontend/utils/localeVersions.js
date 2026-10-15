/**
 * Из ответа Strapi с locale=* (каждая запись — во всех своих языковых версиях) оставляет
 * по одной версии записи: ту, чей язык раньше в цепочке (contentLocales из config/i18n).
 * Порядок записей — порядок выбранных версий в ответе, то есть сортировка Strapi по их
 * значениям: у версий на разных языках поля сортировки могут различаться.
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

  rows.forEach((row, position) => {
    if (row.locale && !chain.includes(row.locale)) return
    const versions = documents.get(row.documentId) ?? []
    versions.push({ row, position })
    documents.set(row.documentId, versions)
  })

  return [...documents.values()]
    .map((versions) => {
      const best = versions.reduce((a, b) => (chain.indexOf(b.row.locale) < chain.indexOf(a.row.locale) ? b : a))
      const localizations = versions.filter(version => version !== best).map(({ row }) => ({ locale: row.locale }))
      return { position: best.position, entry: { ...best.row, localizations } }
    })
    .sort((a, b) => a.position - b.position)
    .map(({ entry }) => entry)
}
