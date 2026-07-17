import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { moduleGroups } from '../src/data/module-meta.js'

const docsRoot = resolve(import.meta.dirname, '..')
const workspaceRoot = resolve(docsRoot, '../..')
const modules = moduleGroups.flatMap((group) => group.modules)
const errors = []

function pascalCase(value) {
  return value.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')
}

if (new Set(modules.map((module) => module.id)).size !== modules.length) errors.push('module ids must be unique')
if (modules.length !== 22) errors.push(`expected 22 module pages, found ${modules.length}`)

for (const module of modules) {
  if (module.examples.length < 2) errors.push(`${module.id} needs at least two examples`)
  const demoIds = new Set(module.examples.map((example) => example.demo ?? module.id))
  for (const demoId of demoIds) {
    try {
      await access(resolve(docsRoot, `src/demos/${pascalCase(demoId)}Demo.jsx`))
    } catch {
      errors.push(`${module.id} references missing demo ${demoId}`)
    }
  }
}

const indexSource = await readFile(resolve(workspaceRoot, 'packages/teal/src/index.ts'), 'utf8')
const api = JSON.parse(await readFile(resolve(docsRoot, 'src/generated/api.json'), 'utf8'))
const documented = new Set(modules.flatMap((module) => module.apiNames))
const exported = new Set()
for (const match of indexSource.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
  for (const name of match[1].split(',').map((part) => part.trim().split(/\s+as\s+/)[0]).filter(Boolean)) exported.add(name)
}
const intentionallyUndocumented = new Set([
  'buttonVariants',
  'iconButtonVariants',
  'fieldVariants',
  'badgeVariants',
  'topBarVariants',
  'verticalNavVariants',
  // Function and hook exports are documented in module usage snippets, not in
  // generated interface tables, so they have no api.json entry by design.
  'toast',
  'dismissToast',
  'mergeDescriptionIds',
  'useFieldControl',
])
for (const name of exported) {
  const isDocumentedTypeCompanion = name.endsWith('Props') || /(?:Option|Item|Column|Variant|Input)$/.test(name)
  if (!documented.has(name) && !intentionallyUndocumented.has(name) && !isDocumentedTypeCompanion && !api.some((entry) => entry.displayName === name)) {
    errors.push(`public export ${name} has no registry representation`)
  }
}

if (errors.length) throw new Error(`Documentation registry validation failed:\n${errors.join('\n')}`)
console.log(`Documentation registry valid: ${modules.length} modules, ${exported.size} named exports checked`)
