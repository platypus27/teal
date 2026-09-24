import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const modulesDir = resolve(import.meta.dirname, '../src/data/modules')
const output = resolve(import.meta.dirname, '../src/generated/search-index.json')

// Full-text search covers guidance, anatomy, dos/donts, and accessibility notes
// — the prose a docs reader is hunting for when a keyword search misses the
// module title. The palette lazy-loads this index on first open.
const { accessibility } = await import(resolve(modulesDir, '../accessibility.js'))

const entries = {}
for (const file of (await readdir(modulesDir)).sort()) {
  if (!file.endsWith('.js')) continue
  const id = file.replace(/\.js$/, '')
  const meta = (await import(resolve(modulesDir, file))).default
  const parts = [
    meta.description,
    meta.anatomy?.map((entry) => `${entry.part} ${entry.description}`).join(' '),
    meta.dosDonts?.dos?.join(' '),
    meta.dosDonts?.donts?.join(' '),
    meta.guidance ? [meta.guidance.useWhen, meta.guidance.avoidWhen, meta.guidance.behavior, meta.guidance.responsive].filter(Boolean).join(' ') : undefined,
    accessibility[id]?.notes?.join(' '),
    accessibility[id]?.keyboard?.map((row) => `${row.keys.join(' ')} ${row.action}`).join(' '),
    meta.examples?.map((example) => `${example.title} ${example.description ?? ''}`).join(' '),
  ].filter(Boolean)
  entries[id] = parts.join(' ').replace(/\s+/g, ' ').trim()
}

await mkdir(resolve(output, '..'), { recursive: true })
const contents = `${JSON.stringify(entries, null, 2)}\n`
if (process.argv.includes('--check')) {
  const current = await readFile(output, 'utf8').catch(() => '')
  if (current !== contents) throw new Error('generated/search-index.json is stale - run npm run generate:search')
} else {
  await writeFile(output, contents)
}
console.log(`search-index.json: ${Object.keys(entries).length} module(s)`)
