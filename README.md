## Personal site-portfolio for UI/UX designer

#### Used:
- Node 24, Yarn 4
- Nuxt 4, @nuxtjs/i18n 10
- SCSS
- Strapi 5

The upgrade from Strapi 4 / Nuxt 3 and how to roll it out: [docs/UPGRADE.md](docs/UPGRADE.md).

### Configuration

All settings live in **one `.env` file in the project root** — there are no `.env` files in
`backend/` or `frontend/`. Start from the template:

```sh
cp .env.example .env
```

- The main setting is `SITE_URL`: the domain for Traefik and HTTPS, Strapi's address
  (`SITE_URL/strapi`), links in emails and RSS and the allowed CORS origin are derived from it.
- **Docker** (`make dev`, `make prod`): `docker-compose.yml` reads the root `.env` and passes each
  service only the variables it needs, so Strapi's secrets never reach the Nuxt container.
  A new variable must also be added to `docker-compose.yml`.
- **Without Docker**: `yarn develop` in `backend/` and `yarn dev` in `frontend/` load `../.env`.

### Secrets

The root `.env` holds Strapi's `APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT` and
the SMTP password. **It must be `600`** — readable only by the account that owns it, never by every
user on the host. `make dev` and `make prod` apply `chmod 600 .env` on every run, so the permission
survives a redeploy instead of having to be re-applied by hand.

Check it with:

```sh
stat -c '%a %n' .env    # Linux
stat -f '%Lp %N' .env   # macOS
```

It should read `600`. Docker Compose reads the file as the user running the deploy, so `600` does
not stop the containers from getting their environment.
