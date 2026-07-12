#!/usr/bin/env node
/**
 * Generates public/llms.txt (index) and public/llms-full.txt (complete
 * documentation in a single file) from the same data sources the app uses:
 * module-meta.js, generated api.json, demo sources, and changelog.json.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { moduleGroups } from '../src/data/module-meta.js'
import { recipes } from '../src/data/recipes.js'
import {
  changelogMarkdown,
  foundationsMarkdown,
  gettingStartedMarkdown,
  moduleMarkdown,
  recipesMarkdown,
} from '../src/lib/markdown.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const api = JSON.parse(readFileSync(join(root, 'src/generated/api.json'), 'utf8'))
const changelog = JSON.parse(readFileSync(join(root, 'src/generated/changelog.json'), 'utf8'))

function pascalCase(id) {
  return id
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')
}

function readDemo(id) {
  return readFileSync(join(root, `src/demos/${pascalCase(id)}Demo.jsx`), 'utf8')
}

const modules = moduleGroups.flatMap((group) => group.modules)

const modulePages = modules.map((module) => ({
  ...module,
  examples: module.examples.map((example) => ({
    ...example,
    source: readDemo(example.demo ?? module.id),
  })),
}))

const recipePages = recipes.map((recipe) => ({
  title: recipe.title,
  description: recipe.description,
  source: readFileSync(join(root, `src/demos/${recipe.file}`), 'utf8'),
}))

const indexLines = [
  '# Teal design system',
  '',
  `> Documentation for @kryv/teal v${changelog.version} - typed React modules, semantic design tokens, and tested interaction behavior for Kryv applications.`,
  '',
  '## Start',
  '',
  '- [Getting started](/): installation, Tailwind preset, fonts, and theming.',
  '- [Foundations](/foundations): semantic color, typography, shape, and motion tokens.',
  '- [Changelog](/changelog): versioned changes to @kryv/teal.',
  '',
  '## Modules',
  '',
]

for (const group of moduleGroups) {
  for (const module of group.modules) {
    indexLines.push(`- [${module.name}](/modules/${module.id}) (${group.name}): ${module.description}`)
  }
}

indexLines.push(
  '',
  '## Patterns',
  '',
  '- [Recipes](/recipes): product compositions built from published modules.',
  '',
  '## Optional',
  '',
  '- [Full documentation](/llms-full.txt): every page above in a single Markdown file.',
  '',
)

const fullSections = [
  `# Teal design system - full documentation\n\nVersion: v${changelog.version}`,
  gettingStartedMarkdown(),
  foundationsMarkdown(),
  ...modulePages.map((module) => moduleMarkdown(module, api)),
  recipesMarkdown(recipePages),
  changelogMarkdown(changelog),
]

const publicDir = join(root, 'public')
mkdirSync(publicDir, { recursive: true })
const outputs = new Map([
  [join(publicDir, 'llms.txt'), indexLines.join('\n')],
  [join(publicDir, 'llms-full.txt'), fullSections.join('\n---\n\n')],
])
if (process.argv.includes('--check')) {
  for (const [path, contents] of outputs) {
    let current = ''
    try {
      current = readFileSync(path, 'utf8')
    } catch {
      // The comparison below reports a missing generated output as stale.
    }
    if (current !== contents) throw new Error(`${path.replace(`${root}/`, '')} is stale - run npm run generate:llms`)
  }
} else {
  for (const [path, contents] of outputs) writeFileSync(path, contents)
}

console.log(`llms.txt: ${modules.length} modules indexed`)
console.log(`llms-full.txt: ${fullSections.length} sections`)
