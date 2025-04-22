.PHONY: dev prod build merge_env generate_traefik clean

merge_env:
	chmod +x merge_env.sh
	./merge_env.sh

generate_traefik:
	bash -c "set -a && source .env && envsubst < docker-compose.traefik.template.yml > docker-compose.traefik.yml"

dev: clean merge_env
	docker compose --env-file .env -f docker-compose.dev.yml up --build

prod: merge_env generate_traefik build
	docker compose --env-file .env -f docker-compose.prod.yml -f docker-compose.traefik.yml up -d

build:
	docker compose --env-file .env -f docker-compose.prod.yml -f docker-compose.traefik.yml build

clean:
	docker compose -f docker-compose.dev.yml down || true
	rm -rf frontend/.output frontend/.nuxt frontend/.vite frontend/.turbo
	rm -rf backend/.cache backend/build backend/.tmp/*.lock

