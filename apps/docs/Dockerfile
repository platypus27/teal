# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/teal/package.json ./packages/teal/package.json
COPY apps/docs/package.json ./apps/docs/package.json
RUN npm ci

COPY packages/teal ./packages/teal
COPY apps/docs ./apps/docs

# Build the site under its version prefix so per-version paths resolve.
RUN npm run build --workspace @kryv/teal \
    && DOCS_VERSION="$(node -p "require('./packages/teal/package.json').version")" \
    && DOCS_BASE_PATH="/$DOCS_VERSION/" npm run build --workspace @kryv/teal-docs \
    && mkdir -p /opt/docs-dist/"$DOCS_VERSION" \
    && mv apps/docs/dist/* /opt/docs-dist/"$DOCS_VERSION"/ \
    && printf '%s' "$DOCS_VERSION" > /opt/docs-dist/version.txt

FROM nginx:stable-alpine AS serve
COPY --from=build /opt/docs-dist /opt/docs-dist
COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/docs/docker-entrypoint.sh /docker-entrypoint.d/40-sync-versions.sh
RUN chmod +x /docker-entrypoint.d/40-sync-versions.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
