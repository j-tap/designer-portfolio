## Personal site-portfolio for UI/UX designer

#### Used:
- Nuxt 3
- I18n
- SCSS
- Strapi

### Secrets

`backend/.env`, `frontend/.env` and the root `.env` hold Strapi's `APP_KEYS`, `JWT_SECRET`,
`ADMIN_JWT_SECRET`, `API_TOKEN_SALT` and the SMTP password. **All three must be `600`** —
readable only by the account that owns them, never by every user on the host.

`merge_env.sh`, which `make dev` and `make prod` run to build the root `.env` from the two
service files, sets `umask 077` and applies `chmod 600` to all three, so the permissions
survive a redeploy instead of having to be re-applied by hand.

Check them with:

```sh
stat -c '%a %n' .env backend/.env frontend/.env    # Linux
stat -f '%Lp %N' .env backend/.env frontend/.env   # macOS
```

Every line should read `600`. Docker Compose reads these files as the user running the
deploy, so `600` does not stop the containers from getting their environment.