FROM node:24-alpine AS build

WORKDIR /app

RUN mkdir -p .yarn/releases
COPY .yarn/releases/yarn-4.18.1.cjs .yarn/releases/
COPY .yarnrc.yml ./
# Local fixes to dependencies (yarn patch), applied by yarn install
COPY .yarn/patches .yarn/patches

RUN corepack enable && corepack prepare yarn@4.18.1 --activate

COPY package.json yarn.lock ./

# --immutable: install exactly what yarn.lock pins and fail if it is out of date.
# The old branch never ran — compose passes MODE, not NODE_ENV_BACKEND — and its
# `|| yarn install` fallback would have silently re-resolved versions anyway.
RUN yarn install --immutable

COPY . .

# Variables come from the root .env through docker-compose.yml, not from a file in the image.
# `strapi build` needs only Strapi's public URL (derived from these), which it bakes into the admin panel.
ARG SITE_URL
ARG STRAPI_PUBLIC_URL
# Shown on the LLM Translator settings page in the admin panel
ARG STRAPI_ADMIN_LLM_TRANSLATOR_LLM_BASE_URL
ARG STRAPI_ADMIN_LLM_TRANSLATOR_LLM_MODEL

RUN yarn build

# node directly rather than through yarn/npm, so the container stop signal reaches Strapi itself
CMD ["node", "node_modules/@strapi/strapi/bin/strapi.js", "start"]
