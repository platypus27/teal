FROM node:24.19.0-alpine3.24@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/teal/package.json ./packages/teal/package.json
COPY apps/docs/package.json ./apps/docs/package.json
RUN npm install --global npm@11.19.0 \
    && npm ci --ignore-scripts

COPY packages/teal ./packages/teal
COPY apps/docs ./apps/docs
RUN npm run build --workspace @kryv/teal && npm run build --workspace @kryv/teal-docs

FROM nginxinc/nginx-unprivileged:1.30.4-alpine3.24@sha256:44e36330f74d4f3a1d4e222acca9e23b401fb87811a7597024502bb759c4dd49 AS serve
COPY --from=build --chown=101:101 /app/apps/docs/dist /usr/share/nginx/html
COPY --chown=101:101 apps/docs/nginx.conf /etc/nginx/conf.d/default.conf
USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
