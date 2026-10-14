.PHONY: dev prod build check_env generate_traefik clean

COMPOSE_DEV = docker compose --env-file .env -f docker-compose.yml -f docker-compose.dev.yml
COMPOSE_PROD = docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.traefik.yml

# The single .env in the project root holds Strapi's signing keys and the SMTP password,
# so it must be readable by the owner only. Re-applied on every run because a file
# copied to the server some other way keeps its own permissions.
check_env:
	@test -f .env || { echo "check_env: .env not found — copy .env.example to .env and fill it in" >&2; exit 1; }
	@chmod 600 .env

# Only the variables the template needs are read: sourcing the whole .env would make
# the shell try to run parts of values with spaces (such as an SMTP app password) as commands.
generate_traefik: check_env
	@set -a; eval "$$(grep -E '^(TRAEFIK_DOMAIN|PORT_BACKEND|PORT_FRONTEND)=' .env)"; set +a; \
	envsubst '$${TRAEFIK_DOMAIN} $${PORT_BACKEND} $${PORT_FRONTEND}' < docker-compose.traefik.template.yml > docker-compose.traefik.yml

dev: clean check_env
	$(COMPOSE_DEV) up --build

prod: check_env generate_traefik build
	$(COMPOSE_PROD) up -d

build: check_env generate_traefik
	$(COMPOSE_PROD) build

clean:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down || true
	rm -rf frontend/.output frontend/.nuxt frontend/.vite frontend/.turbo
	rm -rf backend/.cache backend/build backend/.tmp/*.lock
