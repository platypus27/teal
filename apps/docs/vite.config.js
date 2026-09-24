import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// DOCS_BASE_PATH mounts the site under a version prefix (e.g. /0.5.2/) for the
// per-version docs hosting; the default keeps dev and CI at the root.
export default defineConfig({
  plugins: [react()],
  base: process.env.DOCS_BASE_PATH ?? '/',
  server: { port: 5173 },
})
