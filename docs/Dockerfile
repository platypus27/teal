# syntax=docker/dockerfile:1
# Multi-stage build for the teal docs showcase.
# Build context is the REPO ROOT (set in docker-compose.yml) because the docs
# app imports the library via relative parent paths (../ui, ../global.css, …).

FROM node:22-alpine AS build
WORKDIR /app

# Library surface the docs app imports through relative paths.
COPY ui ./ui
COPY tokens.css global.css tailwind.preset.js ./

# Install docs deps first for better layer caching.
COPY docs/package.json docs/package-lock.json ./docs/
RUN cd docs && npm ci

# Build the static site.
COPY docs ./docs
RUN cd docs && npm run build


FROM nginx:stable-alpine AS serve
COPY --from=build /app/docs/dist /usr/share/nginx/html
COPY docs/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
