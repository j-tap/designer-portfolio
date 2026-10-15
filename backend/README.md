## Backend: Strapi 5

Configuration comes from the root `.env` (see the project [README](../README.md)); there is no `.env` in this folder.

```sh
yarn develop   # admin panel with the Content-Type Builder, autoreload
yarn build     # build the admin panel
yarn start     # production mode (schemas are read-only in the admin)
```

Content types (fields) are changed only in `develop` mode: the Content-Type Builder writes them to
`src/api/**/schema.json` and `src/components/**`, which are committed and deployed. In production
the builder is read-only.

Project-specific code:

- `src/middlewares/populate-deep.js` — `?populate=deep` used by the frontend (replaces the v4 plugin)
- `src/index.js`, `src/utils/blurhash.js` — blurhash of uploaded images
- `src/utils/image-variants.js`, `src/middlewares/uploads.js` — WebP copies of images resized by width
  (`/uploads/_w<width>/<file>.webp`) for `srcset` on the site, cached by browsers for a year; 304 responses
  for the originals. Copies are created after an upload, in the background after start for the whole
  library, and on the first request otherwise. They live next to the originals in `public/uploads/_w*`
  (about a third of the size of the originals) and can be deleted at any time: they are recreated
- `src/api/review` — the public review form: token, rate limit, file checks, notification email

The upgrade from Strapi 4 and its decisions: [docs/UPGRADE.md](../docs/UPGRADE.md).
