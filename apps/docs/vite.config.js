import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

function rewriteRouteEntry(request, _response, next) {
  const [pathname, query] = (request.url ?? '/').split('?', 2)
  let entry = null
  if (/^\/modules\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(pathname)) entry = '/module.html'
  if (/^\/recipes\/?$/.test(pathname)) entry = '/recipes.html'
  if (entry) request.url = `${entry}${query ? `?${query}` : ''}`
  next()
}

function routeHtmlEntries() {
  return {
    name: 'teal-route-html-entries',
    configureServer(server) {
      server.middlewares.use(rewriteRouteEntry)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteRouteEntry)
    },
  }
}

export default defineConfig({
  plugins: [routeHtmlEntries(), react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        module: resolve(import.meta.dirname, 'module.html'),
        recipes: resolve(import.meta.dirname, 'recipes.html'),
      },
    },
  },
  server: { port: 5173 },
})
