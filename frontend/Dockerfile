FROM node:20

WORKDIR /app

RUN mkdir -p .yarn/releases

COPY .yarn/releases/yarn-4.9.1 .yarn/releases/
COPY .yarnrc.yml ./

RUN corepack enable && corepack prepare yarn@4.9.1 --activate

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ARG MODE=production
ENV NODE_ENV=${MODE}

RUN yarn build

CMD ["node", ".output/server/index.mjs"]
