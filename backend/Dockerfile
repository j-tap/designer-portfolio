FROM node:20-alpine AS build

WORKDIR /app

RUN mkdir -p .yarn/releases
COPY .yarn/releases/yarn-4.9.1.cjs .yarn/releases/
COPY .yarnrc.yml ./

RUN corepack enable && corepack prepare yarn@4.9.1 --activate

COPY package.json yarn.lock ./

ARG NODE_ENV_BACKEND=dev
ENV NODE_ENV_BACKEND=${NODE_ENV_BACKEND}

RUN if [ "$NODE_ENV_BACKEND" = "production" ]; then \
      yarn install --immutable --check-cache || yarn install; \
    else \
      yarn install; \
    fi

COPY . .

RUN yarn build

CMD ["npm", "run", "start"]
