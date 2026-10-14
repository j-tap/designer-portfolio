const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:']

/**
 * Возвращает ссылку, только если её безопасно подставить в href.
 * Отсекает javascript:, data:, vbscript: и прочие схемы, через которые выполняется код.
 * Ссылку без схемы, похожую на домен (example.com/page), дополняет https://.
 * Относительные пути (/page, #anchor) пропускаются как есть.
 *
 * @param {string} value
 * @return {string|undefined}
 */
export function safeUrl (value) {
  if (typeof value !== 'string') return undefined

  // Браузер игнорирует пробелы и управляющие символы в схеме: "java\tscript:" всё равно выполнится
  const url = value.replace(/[\u0000- \u007F]+/g, ' ').trim()
  if (!url) return undefined

  if (/^(\/(?!\/)|#|\?)/.test(url)) return url

  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('//')
    ? url
    : `https://${url}`

  try {
    const { protocol } = new URL(withScheme, 'https://localhost')
    return SAFE_PROTOCOLS.includes(protocol) ? withScheme : undefined
  }
  catch {
    return undefined
  }
}

/**
 * @param {string} value
 * @return {string}
 */
export function escapeHtml (value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
