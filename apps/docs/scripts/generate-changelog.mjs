import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../../..')
const changelogPath = resolve(root, 'packages/teal/CHANGELOG.md')
const packagePath = resolve(root, 'packages/teal/package.json')
const output = resolve(root, 'apps/docs/src/generated/changelog.json')

const pkg = JSON.parse(await readFile(packagePath, 'utf8'))

function parseChangelog(markdown) {
  const entries = []
  let current = null
  let group = null

  for (const line of markdown.split('\n')) {
    const versionMatch = /^##\s+(.+?)\s*$/.exec(line)
    if (versionMatch) {
      current = { version: versionMatch[1], groups: [] }
      entries.push(current)
      group = null
      continue
    }
    if (!current) continue

    const groupMatch = /^###\s+(.+?)\s*$/.exec(line)
    if (groupMatch) {
      group = { label: groupMatch[1], items: [] }
      current.groups.push(group)
      continue
    }

    const itemMatch = /^-\s+(.+?)\s*$/.exec(line)
    if (itemMatch && group) {
      group.items.push(itemMatch[1].replace(/^[0-9a-f]{7,}:\s*/, ''))
      continue
    }

    const last = group?.items.at(-1)
    if (last && line.trim() && !line.startsWith('#')) {
      group.items[group.items.length - 1] = `${last} ${line.trim()}`
    }
  }

  return entries
}

const historicalBaseline = {
  version: '0.2.0',
  groups: [{
    label: 'Historical baseline',
    items: [
      'Public ESM package with React 18 and React 19 peer support.',
      '22 typed modules with compiled styles, semantic tokens, and TypeScript declarations.',
      'Responsive documentation with examples, playgrounds, recipes, and accessibility coverage.',
    ],
  }],
}

let entries = []
try {
  const markdown = await readFile(changelogPath, 'utf8')
  entries = parseChangelog(markdown)
} catch {
  // The shipped 0.2.0 roadmap is the historical baseline. Changesets owns
  // every release entry after this point, so no changelog is edited here.
  entries = [historicalBaseline]
}

if (!entries.some((entry) => entry.version === historicalBaseline.version)) {
  // CHANGELOG.md is newest-first; the baseline is the oldest release, so it goes last.
  entries = [...entries, historicalBaseline]
}

await mkdir(resolve(output, '..'), { recursive: true })
const contents = `${JSON.stringify({ version: pkg.version, entries }, null, 2)}\n`
if (process.argv.includes('--check')) {
  const current = await readFile(output, 'utf8').catch(() => '')
  if (current !== contents) throw new Error('generated/changelog.json is stale - run npm run generate:changelog')
} else {
  await writeFile(output, contents)
}
console.log(`changelog.json: version ${pkg.version}, ${entries.length} release(s)`)
