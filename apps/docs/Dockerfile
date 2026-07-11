# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/teal/package.json ./packages/teal/package.json
COPY apps/docs/package.json ./apps/docs/package.json
RUN npm ci

COPY packages/teal ./packages/teal
COPY apps/docs ./apps/docs
RUN npm run build --workspace @kryv/teal && npm run build --workspace @kryv/teal-docs

FROM nginx:stable-alpine AS serve
COPY --from=build /app/apps/docs/dist /usr/share/nginx/html
COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
