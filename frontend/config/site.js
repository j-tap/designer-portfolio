// Все адреса выводятся из SITE_URL — единственного адреса сайта в .env.
// Тот же расчёт в бэкенде: backend/src/utils/urls.js.

export const siteUrl = new URL(process.env.SITE_URL || 'http://localhost:3000').origin

// Публичный адрес Strapi (для браузера). В проде Traefik отдаёт Strapi по пути /strapi
// того же домена; при локальной разработке он задаётся явно через STRAPI_PUBLIC_URL
export const strapiPublicUrl = (process.env.STRAPI_PUBLIC_URL || `${siteUrl}/strapi`).replace(/\/+$/, '')

// Адрес Strapi для запросов с сервера Nuxt. В Docker его задаёт docker-compose.yml
// (внутренний адрес сервиса), без Docker совпадает с публичным
export const strapiServerUrl = (process.env.STRAPI_URL || strapiPublicUrl).replace(/\/+$/, '')
