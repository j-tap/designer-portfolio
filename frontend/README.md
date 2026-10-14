## Frontend: Nuxt 4

Configuration comes from the root `.env` (see the project [README](../README.md)).

```sh
yarn dev       # development server
yarn build     # production build (.output)
```

Where things are:

- `composables/useApi.js` — `useStrapiData` / `useRequiredStrapiData` (data from Strapi for a page,
  404 when a required record is missing) and `useMedia` (URLs of Strapi media files)
- `composables/useMeta.js`, `useStructuredData.js` — page title, description, social cards and JSON-LD;
  canonical and hreflang come from `@nuxtjs/i18n` (`useLocaleHead` in `app.vue`)
- `composables/usePortfolio.js`, `config/portfolio.js` — portfolio lists, project pages, breadcrumbs, URLs
- `pages/portfolio/[category]/[slug]` — a project of the category or a subcategory (decided by the data)
- `server/` — posts from LinkedIn (cached), sitemap source, RSS, robots.txt
