// utils/ сервер в режиме разработки загружает без сборщика: импорт — относительный, с расширением
import { formatRelativeDate } from './formatDate.js'

export function getPostTitle(post) {
  if (!post?.text) return ''
  const text = post.text.replace(/\n/g, ' ').trim()
  
  const sentenceEndRegex = /[.!?(≠'"]/
  const match = text.match(sentenceEndRegex)
  
  let title = ''
  if (match && match.index !== undefined) {
    title = text.substring(0, match.index + 1).trim().replace(/[(≠'"]/g, '')
  } else {
    title = text
  }
  
  if (title.length > 150 && title.includes(',')) {
    const commaIndex = title.indexOf(',')
    title = title.substring(0, commaIndex).trim()
  } else if (title.length > 150) {
    title = title.substring(0, 147) + '...'
  }
  
  return title
}

export function getPostImage (post) {
  return post?.image || null
}

/**
 * Дата поста для показа: «3 дня назад» — как её отдаёт LinkedIn, иначе дата загрузки поста.
 * t и d — из useI18n() страницы.
 */
export function formatPostDate (post, { t, d }) {
  if (post.date_value !== undefined && post.date_unit) {
    return formatRelativeDate({ value: post.date_value, unit: post.date_unit, raw: post.date_raw }, t)
  }
  return post.created_at ? d(post.created_at, 'date') : ''
}

export function getPostPreview(post) {
  if (!post?.text) return ''
  const text = post.text.replace(/\n/g, ' ').trim()
  
  const sentenceEndRegex = /[.!?]\s/
  const match = text.match(sentenceEndRegex)
  
  if (match && match.index !== undefined) {
    const secondSentenceStart = match.index + match[0].length
    const previewText = text.substring(secondSentenceStart).trim()
    return previewText.length > 200 ? previewText.substring(0, 197) + '...' : previewText
  }
  
  return text.length > 200 ? text.substring(0, 197) + '...' : text
}
