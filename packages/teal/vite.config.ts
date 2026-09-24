import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { dependencies?: Record<string, string> }
const externalPackages = [
  ...Object.keys(packageJson.dependencies ?? {}),
  'react',
  'react-dom',
]

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    sourcemap: true,
    rollupOptions: {
      external: (id) => externalPackages.some(
        (packageName) => id === packageName || id.startsWith(`${packageName}/`),
      ),
      output: {
        // Every module uses hooks or refs, so each must be marked a client
        // component for React Server Component consumers (Next.js App Router
        // and friends); per-module output keeps the directive per file.
        banner: "'use client'",
        // One file per source module: consumers' bundlers only parse what they
        // import instead of the whole barrel, and tree-shaking gets per-module
        // granularity. The "." export still points at dist/index.js.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
})
