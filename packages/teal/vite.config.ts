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
    rollupOptions: {
      external: (id) => externalPackages.some(
        (packageName) => id === packageName || id.startsWith(`${packageName}/`),
      ),
    },
  },
})
