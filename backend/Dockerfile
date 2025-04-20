FROM node:18

WORKDIR /app

RUN mkdir -p .yarn/releases
COPY .yarn/releases/yarn-4.8.0.cjs .yarn/releases/
COPY .yarnrc.yml ./

RUN corepack enable

COPY package.json yarn.lock ./

ARG MODE=dev
ENV NODE_ENV=${MODE}

RUN if [ "$MODE" = "production" ]; then \
      yarn install --immutable --check-cache || yarn install; \
    else \
      yarn install; \
    fi

COPY . .

CMD ["yarn", "develop"]
