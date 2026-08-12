export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseURL

  const robotsTxt = `# robots.txt

User-agent: *
Allow: /

# Служебные эндпоинты
Disallow: /api/

# Стили и скрипты нужны роботам для корректного рендеринга страниц
Allow: /_nuxt/

# Sitemap
Sitemap: ${baseUrl}/sitemap_index.xml
`
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return robotsTxt
})
