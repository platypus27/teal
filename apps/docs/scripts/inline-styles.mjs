import { lstat, readFile, rename, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve, sep } from 'node:path'

const maximumHtmlBytes = 2 * 1024 * 1024
const maximumStylesheetBytes = 512 * 1024

function boundedRegularFile(stat, maximumBytes, label) {
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${label} must be a regular file`)
  if (stat.size < 1 || stat.size > maximumBytes) {
    throw new Error(`${label} exceeds its bounded size`)
  }
}

async function inlineHtmlStyles(dist, htmlName) {
  const htmlPath = resolve(dist, htmlName)
  const htmlStat = await lstat(htmlPath)
  boundedRegularFile(htmlStat, maximumHtmlBytes, htmlName)
  const html = await readFile(htmlPath, 'utf8')

  const stylesheetLinks = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((link) => /\brel=["']stylesheet["']/i.test(link))
  if (stylesheetLinks.length !== 1) {
    throw new Error(`Expected exactly one initial stylesheet, found ${stylesheetLinks.length}`)
  }

  const link = stylesheetLinks[0]
  const href = link.match(/\bhref=["']([^"']+)["']/i)?.[1]
  if (!href || !/^\/assets\/[A-Za-z0-9._-]+\.css$/.test(href)) {
    throw new Error(`Initial stylesheet has an unsafe path: ${String(href)}`)
  }
  const stylesheetPath = resolve(dist, href.slice(1))
  const assetsDirectory = `${resolve(dist, 'assets')}${sep}`
  if (!stylesheetPath.startsWith(assetsDirectory)) throw new Error('Initial stylesheet escapes the assets directory')

  const stylesheetStat = await lstat(stylesheetPath)
  boundedRegularFile(stylesheetStat, maximumStylesheetBytes, 'Initial stylesheet')
  const stylesheet = await readFile(stylesheetPath, 'utf8')
  if (/<\/style/i.test(stylesheet)) throw new Error('Initial stylesheet contains an unsafe closing style tag')

  const inlined = html.replace(link, `<style data-teal-critical>${stylesheet}</style>`)
  if (inlined === html) throw new Error('Initial stylesheet link was not replaced')
  const temporaryPath = resolve(dirname(htmlPath), `.${basename(htmlPath)}.${process.pid}.tmp`)
  await writeFile(temporaryPath, inlined, { encoding: 'utf8', flag: 'wx', mode: 0o600 })
  await rename(temporaryPath, htmlPath)
  console.log(`Inlined ${stylesheetStat.size} stylesheet bytes into ${htmlName}`)
}

export async function inlineStyles(distDirectory) {
  const dist = resolve(distDirectory)
  for (const htmlName of ['index.html', 'module.html', 'recipes.html']) {
    await inlineHtmlStyles(dist, htmlName)
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  await inlineStyles(resolve(import.meta.dirname, '../dist'))
}
