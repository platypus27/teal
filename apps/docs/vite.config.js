import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// DOCS_BASE_PATH mounts the site under a version prefix (e.g. /0.5.2/) for the
// per-version docs hosting; the default keeps dev and CI at the root.
// TEAL_DOCS_PORT pins the dev server to a specific port (strict, so a busy
// port fails loudly); by default the dev server starts at 5173 and
// auto-bumps to the next free port, so several docs servers can run on one
// shared host. The Playwright suite reserves its preview port per run in
// playwright.config.js (see docs/adr/0012).
export default defineConfig({
  plugins: [react()],
  base: process.env.DOCS_BASE_PATH ?? '/',
  server: {
    port: Number(process.env.TEAL_DOCS_PORT ?? 5173),
    strictPort: process.env.TEAL_DOCS_PORT !== undefined,
  },
})
