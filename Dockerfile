FROM node:12.16.0-alpine as preparation

WORKDIR /app
COPY package.json .
# Create temporary package.json where version is set to 0.0.0
# – this way the cache of the build step won't be invalidated
# if only the version changed.
RUN ["node", "-e", "\
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));\
fs.writeFileSync('package.json', JSON.stringify({ ...pkg, version: '0.0.0' }));\
"]

FROM node:12.16.0-alpine as builder

WORKDIR /app

ARG SENTRY_PROJECT_PREFIX
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG

COPY ./.npmrc ./
COPY --from=preparation /app/package.json .
RUN yarn cache clean
RUN yarn
COPY . .
ENV NODE_ENV production
RUN yarn build:prod
RUN node upload-source-map.js
RUN yarn

FROM node:12.16.0-alpine

WORKDIR /usr/src/app

COPY --from=builder /app/node_modules  ./node_modules
COPY --from=builder /app/build  ./build
COPY --from=builder /app/newrelic.js .

USER node

EXPOSE 3000

CMD ["node", "--max_old_space_size=2048", "build/app.js"]
