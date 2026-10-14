FROM node:24-alpine

WORKDIR /app

RUN mkdir -p .yarn/releases

COPY .yarn/releases/yarn-4.18.1.cjs .yarn/releases/
COPY .yarnrc.yml ./

RUN corepack enable && corepack prepare yarn@4.18.1 --activate

COPY package.json yarn.lock ./
RUN yarn install --immutable

COPY . .

ARG MODE=production
ENV NODE_ENV=${MODE}

# Variables come from the root .env through docker-compose.yml, not from a file in the image.
# nuxt.config reads these at build time (runtime values are passed as environment).
ARG SITE_URL
ARG STRAPI_PUBLIC_URL
ARG STRAPI_URL
ARG YANDEX_METRIKA_ID
ARG GOOGLE_SITE_VERIFICATION
ARG YANDEX_SITE_VERIFICATION

RUN yarn build

CMD ["node", ".output/server/index.mjs"]
