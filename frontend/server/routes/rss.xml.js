import { fetchAllPosts } from '~/server/utils/postsCache'
import { getPostTitle, getPostImage } from '~/utils/post'
import { safeUrl } from '~/utils/url'

// Посты пишутся по-русски: ссылки ведут на русскую версию страницы поста
const POSTS_LOCALE = 'ru'
const RSS_ITEMS = 15

function escapeXml(unsafe) {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// "]]>" внутри текста закрыл бы CDATA раньше времени и сломал ленту
function cdata(value) {
  return `<![CDATA[${String(value ?? '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

export default defineEventHandler(async (event) => {
  // Адрес сайта зашит в сборку (nuxt.config → runtimeConfig.public.siteUrl)
  const BASE_URL = useRuntimeConfig().public.siteUrl
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  try {
    // Из того же кеша, что раздел постов на сайте
    const { data: posts = [] } = await fetchAllPosts()

    const rssItems = posts.slice(0, RSS_ITEMS).map(post => {
      const imageUrl = getPostImage(post)
      const postUrl = `${BASE_URL}/${POSTS_LOCALE}/posts/${post.id}`
      const linkedinUrl = safeUrl(post.url) || ''
      const title = getPostTitle(post)
      // description читалки рендерят как HTML, поэтому текст поста экранируем
      let description = escapeXml(post.text || '')

      if (linkedinUrl) {
        description += `\n\n<a href="${escapeXml(linkedinUrl)}">Читать на LinkedIn</a>`
      }
      if (imageUrl) {
        description += `\n<br/><img src="${escapeXml(imageUrl)}" alt="Post image" />`
      }

      // Дата в формате RFC 822, который ждёт RSS: «Wed, 14 Oct 2026 17:20:00 GMT»
      const pubDate = post.created_at ? `<pubDate>${new Date(post.created_at).toUTCString()}</pubDate>` : ''

      return `
    <item>
      <title>${cdata(title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      ${pubDate}
      <description>${cdata(description)}</description>
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
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
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
