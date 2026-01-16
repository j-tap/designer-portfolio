export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseURL
  
  const robotsTxt = `# robots.txt

User-agent: *
Allow: /

# Исключаем служебные страницы
Disallow: /api/
Disallow: /_nuxt/
Disallow: /admin/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay: 1
`
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  
  return robotsTxt
})
