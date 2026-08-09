import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const dist = resolve(import.meta.dirname, '../dist')
const maximumBytes = 160 * 1024
for (const htmlName of ['index.html', 'module.html', 'recipes.html']) {
  const html = await readFile(resolve(dist, htmlName), 'utf8')
  if (/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/i.test(html)) {
    throw new Error(`${htmlName} retains a render-blocking external stylesheet`)
  }
  if (!/<style\b[^>]*\bdata-teal-critical(?:=["'][^"']*["'])?[^>]*>/i.test(html)) {
    throw new Error(`${htmlName} is missing its inlined critical stylesheet`)
  }
  const initialAssets = new Set()
  for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\/assets\/[^"]+\.js)"[^>]*>/g)) {
    initialAssets.add(match[1].slice(1))
  }
  if (initialAssets.size === 0) throw new Error(`${htmlName} has no initial JavaScript assets`)
  if ([...initialAssets].some((asset) => asset.includes('module-meta'))) {
    throw new Error(`Large module-meta payload leaked into ${htmlName}`)
  }

  let compressedBytes = 0
  for (const asset of initialAssets) {
    compressedBytes += gzipSync(await readFile(resolve(dist, asset))).length
  }
  if (compressedBytes > maximumBytes) {
    throw new Error(`${htmlName} JavaScript exceeds ${maximumBytes} compressed bytes: ${compressedBytes}`)
  }
  console.log(`${htmlName} JavaScript: ${compressedBytes} compressed bytes across ${initialAssets.size} assets`)
}

const modulePageAssets = (await readdir(resolve(dist, 'assets')))
  .filter((asset) => /^ModulePage-[A-Za-z0-9_-]+\.js$/.test(asset))
if (modulePageAssets.length !== 1) {
  throw new Error(`Expected exactly one ModulePage asset, found ${modulePageAssets.length}`)
}
const modulePageBytes = gzipSync(await readFile(resolve(dist, 'assets', modulePageAssets[0]))).length
const maximumModulePageBytes = 80 * 1024
if (modulePageBytes > maximumModulePageBytes) {
  throw new Error(`ModulePage exceeds ${maximumModulePageBytes} compressed bytes: ${modulePageBytes}`)
}
console.log(`ModulePage JavaScript: ${modulePageBytes} compressed bytes`)
