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

export function getPostImage(post) {
  // Fallback на простое поле image
  if (post?.image) {
    return post.image
  }

  if (!post?.content?.images || !Array.isArray(post.content.images) || post.content.images.length === 0) {
    return null
  }

  const firstImageSet = post.content.images[0]
  if (!firstImageSet?.image || !Array.isArray(firstImageSet.image)) {
    return null
  }

  const targetWidth = 1280
  let bestImage = null
  let bestWidth = 0

  for (const img of firstImageSet.image) {
    if (img.width && img.url) {
      if (img.width === targetWidth) {
        return img.url
      }
      if (img.width < targetWidth && img.width > bestWidth) {
        bestWidth = img.width
        bestImage = img.url
      }
    }
  }

  if (!bestImage) {
    for (const img of firstImageSet.image) {
      if (img.width && img.url && img.width > bestWidth) {
        bestWidth = img.width
        bestImage = img.url
      }
    }
  }

  return bestImage
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
