.PHONY: dev prod build merge_env

merge_env:
	chmod +x merge_env.sh
	./merge_env.sh

clean:
	rm -rf frontend/.output frontend/.nuxt frontend/.vite frontend/.turbo
	rm -rf backend/.cache backend/build backend/.tmp/*.lock

dev: clean merge_env
	docker compose --env-file .env -f docker-compose.yml up --build

prod: merge_env build
	docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d

build:
	docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml build
