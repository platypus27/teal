import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { moduleGroups } from '../src/data/module-meta.js'
import { moduleIndexGroups } from '../src/data/module-index.js'

const docsRoot = resolve(import.meta.dirname, '..')
const workspaceRoot = resolve(docsRoot, '../..')
const modules = moduleGroups.flatMap((group) => group.modules)
const errors = []

function pascalCase(value) {
  return value.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')
}

if (new Set(modules.map((module) => module.id)).size !== modules.length) errors.push('module ids must be unique')
// 200 pre-0.5.1 pages − 33 merged-away + 1 new text-area page (M17).
if (modules.length !== 168) errors.push(`expected 168 module pages after the 0.5.1 consolidation, found ${modules.length}`)
const indexShape = moduleIndexGroups.map((group) => [group.name, group.modules.map((module) => module.id)])
const fullShape = moduleGroups.map((group) => [group.name, group.modules.map((module) => module.id)])
if (JSON.stringify(indexShape) !== JSON.stringify(fullShape)) errors.push('module-index.js and module-meta.js disagree on groups or module order')

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
// Every registered apiName must resolve to a generated interface-table entry;
// otherwise the module page silently renders no props documentation.
for (const name of documented) {
  if (!api.some((entry) => entry.displayName === name)) errors.push(`registry apiName ${name} has no api.json entry`)
}
const exported = new Set()
// Type-only re-exports (TableSort, SelectOption, …) are documented alongside
// their component's props table, so only value exports need registry entries.
for (const match of indexSource.matchAll(/export\s+(type\s+)?\{([^}]+)\}/g)) {
  if (match[1]) continue
  for (const name of match[2].split(',').map((part) => part.trim().split(/\s+as\s+/)[0]).filter(Boolean)) exported.add(name)
}
const intentionallyUndocumented = new Set([
  'buttonVariants',
  'iconButtonVariants',
  'fieldVariants',
  'badgeVariants',
  'alertVariants',
  'avatarVariants',
  'topBarVariants',
  'notificationItemVariants',
  'containerVariants',
  'sectionVariants',
  'statusDotVariants',
  // Function and hook exports are documented in module usage snippets, not in
  // generated interface tables, so they have no api.json entry by design.
  'toast',
  'dismissToast',
  'mergeDescriptionIds',
  'useFieldControl',
  'chartColors',
  'chartColorAt',
  'niceTicks',
  'useFormErrors',
  'useFormFieldError',
  'applyMask',
  'defaultPasswordScore',
  'phoneCountries',
  'encodeQrMatrix',
])
for (const name of exported) {
  const isDocumentedTypeCompanion = name.endsWith('Props') || /(?:Option|Item|Column|Variant|Input|Action|User|Row|Status|Group|Tone|Range|Delta|Theme|Step|Menu|Destination|Home|Series|Point|Day|Tick|Comment|Parts|Line|Value|Stage|Task|Threshold|Card|Image|Level|Node|Country|Datum|State|Heading)$/.test(name)
  if (!documented.has(name) && !intentionallyUndocumented.has(name) && !isDocumentedTypeCompanion && !api.some((entry) => entry.displayName === name)) {
    errors.push(`public export ${name} has no registry representation`)
  }
}

if (errors.length) throw new Error(`Documentation registry validation failed:\n${errors.join('\n')}`)
console.log(`Documentation registry valid: ${modules.length} modules, ${exported.size} named exports checked`)
