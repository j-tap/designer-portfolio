import { getPostTitle, getPostImage } from '~/utils/post'

const BASE_URL = process.env.BASE_URL
const DEFAULT_LOCALE = 'ru'

function escapeXml(unsafe) {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatRssDate(dateString) {
  const date = new Date(dateString)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const day = days[date.getUTCDay()]
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  
  return `${day}, ${String(date.getUTCDate()).padStart(2, '0')} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  try {
    const postsResponse = await $fetch('/api/posts', {
      headers: {
        'Accept': 'application/json'
      }
    })

    const posts = postsResponse?.data || []

    const rssItems = posts.map(post => {
      const imageUrl = getPostImage(post)
      const postUrl = `${BASE_URL}/${DEFAULT_LOCALE}/posts/${post.id}`
      const linkedinUrl = post.url || ''
      const title = getPostTitle(post)
      let description = post.text || ''

      if (linkedinUrl) {
        description += `\n\n<a href="${escapeXml(linkedinUrl)}">Читать на LinkedIn</a>`
      }
      if (imageUrl) {
        description += `\n<br/><img src="${escapeXml(imageUrl)}" alt="Post image" />`
      }

      const pubDate = formatRssDate(post.created_at)

      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      ${imageUrl ? `<enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" />` : ''}
    </item>`
    }).join('')

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Diana Konoiko - Posts</title>
    <link>${BASE_URL}</link>
    <description>Posts by Diana Konoiko</description>
    <language>ru-RU</language>
    <lastBuildDate>${formatRssDate(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`

    return rssXml
  }
  catch (error) {
    throw createError({
      statusCode: error?.status || error?.statusCode || 500,
      statusMessage: error?.message || 'Failed to generate RSS feed',
    })
  }
})
