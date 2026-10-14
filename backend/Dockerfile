FROM node:20-alpine AS build

WORKDIR /app

RUN mkdir -p .yarn/releases
COPY .yarn/releases/yarn-4.9.1.cjs .yarn/releases/
COPY .yarnrc.yml ./

RUN corepack enable && corepack prepare yarn@4.9.1 --activate

COPY package.json yarn.lock ./

# --immutable: install exactly what yarn.lock pins and fail if it is out of date.
# The old branch never ran — compose passes MODE, not NODE_ENV_BACKEND — and its
# `|| yarn install` fallback would have silently re-resolved versions anyway.
RUN yarn install --immutable

COPY . .

RUN yarn build

CMD ["npm", "run", "start"]
