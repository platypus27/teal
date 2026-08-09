import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { accessibility } from '../src/data/accessibility.js'
import { moduleGroups } from '../src/data/module-meta.js'
import { playgroundModuleIds } from '../src/data/playground-module-ids.js'

const output = resolve(import.meta.dirname, '../src/generated/module-index.json')
const routeOutput = resolve(import.meta.dirname, '../src/generated/module-route-index.json')
const moduleDirectory = resolve(import.meta.dirname, '../src/generated/modules')
const apiPath = resolve(import.meta.dirname, '../src/generated/api.json')
const api = JSON.parse(await readFile(apiPath, 'utf8'))
if (!Array.isArray(api)) throw new Error('generated/api.json must contain an array')
const playgrounds = new Set(playgroundModuleIds)
const index = moduleGroups.map((group) => ({
  name: group.name,
  modules: group.modules.map((module) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(module.id)) {
      throw new Error(`Unsafe module id: ${module.id}`)
    }
    if (!accessibility[module.id]) throw new Error(`Missing accessibility guidance for ${module.id}`)
    return {
      id: module.id,
      name: module.name,
      apiNames: module.apiNames,
      description: module.description,
      demos: [...new Set(module.examples.map((example) => example.demo ?? module.id))],
      hasPlayground: playgrounds.has(module.id),
    }
  }),
}))
const contents = `${JSON.stringify(index, null, 2)}\n`
const routeContents = `${JSON.stringify(Object.fromEntries(
  moduleGroups.flatMap((group) => group.modules).map((module) => [
    module.id,
    {
      name: module.name,
      apiNames: module.apiNames,
      description: module.description,
      imports: module.imports ?? module.apiNames,
      usage: module.usage,
    },
  ]),
), null, 2)}\n`
const moduleRecords = new Map(
  moduleGroups.flatMap((group) => group.modules).map((module) => [
    `${module.id}.json`,
    `${JSON.stringify({
      ...module,
      accessibility: accessibility[module.id],
      apiEntries: module.apiNames.flatMap((name) => api.filter((entry) => entry.displayName === name)),
    }, null, 2)}\n`,
  ]),
)

await mkdir(resolve(output, '..'), { recursive: true })
await mkdir(moduleDirectory, { recursive: true })
if (process.argv.includes('--check')) {
  const current = await readFile(output, 'utf8').catch(() => '')
  if (current !== contents) {
    throw new Error('generated/module-index.json is stale - run npm run generate:module-index')
  }
  const currentRoutes = await readFile(routeOutput, 'utf8').catch(() => '')
  if (currentRoutes !== routeContents) {
    throw new Error('generated/module-route-index.json is stale - run npm run generate:module-index')
  }
  const currentModules = (await readdir(moduleDirectory)).filter((name) => name.endsWith('.json')).sort()
  const expectedModules = [...moduleRecords.keys()].sort()
  if (JSON.stringify(currentModules) !== JSON.stringify(expectedModules)) {
    throw new Error('generated/modules file set is stale - run npm run generate:module-index')
  }
  for (const [name, record] of moduleRecords) {
    const currentRecord = await readFile(resolve(moduleDirectory, name), 'utf8').catch(() => '')
    if (currentRecord !== record) {
      throw new Error(`generated/modules/${name} is stale - run npm run generate:module-index`)
    }
  }
} else {
  await writeFile(output, contents)
  await writeFile(routeOutput, routeContents)
  const existingModules = await readdir(moduleDirectory)
  await Promise.all(
    existingModules
      .filter((name) => name.endsWith('.json') && !moduleRecords.has(name))
      .map((name) => unlink(resolve(moduleDirectory, name))),
  )
  await Promise.all(
    [...moduleRecords].map(([name, record]) => writeFile(resolve(moduleDirectory, name), record)),
  )
}

console.log(`module-index.json: ${moduleRecords.size} modules indexed`)
