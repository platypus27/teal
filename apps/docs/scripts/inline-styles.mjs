import { constants } from 'node:fs'
import { open, rename, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve, sep } from 'node:path'

const maximumHtmlBytes = 2 * 1024 * 1024
const maximumStylesheetBytes = 512 * 1024

function boundedRegularFile(stat, maximumBytes, label) {
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${label} must be a regular file`)
  if (stat.size < 1n || stat.size > BigInt(maximumBytes)) {
    throw new Error(`${label} exceeds its bounded size`)
  }
}

function sameFileSnapshot(before, after) {
  return before.dev === after.dev
    && before.ino === after.ino
    && before.mode === after.mode
    && before.nlink === after.nlink
    && before.size === after.size
    && before.mtimeNs === after.mtimeNs
    && before.ctimeNs === after.ctimeNs
}

async function readStableFile(file, metadata, maximumBytes, label, encoding) {
  const expectedBytes = Number(metadata.size)
  const bytes = Buffer.allocUnsafe(expectedBytes)
  let offset = 0
  while (offset < expectedBytes) {
    const result = await file.read(bytes, offset, expectedBytes - offset, null)
    if (result.bytesRead === 0) break
    offset += result.bytesRead
  }
  const overflow = await file.read(Buffer.allocUnsafe(1), 0, 1, null)
  const finalMetadata = await file.stat({ bigint: true })
  if (
    offset !== expectedBytes
    || overflow.bytesRead !== 0
    || expectedBytes > maximumBytes
    || !sameFileSnapshot(metadata, finalMetadata)
  ) {
    throw new Error(`${label} changed while it was read`)
  }
  return encoding ? bytes.toString(encoding) : bytes
}

async function inlineHtmlStyles(dist, htmlName) {
  const htmlPath = resolve(dist, htmlName)
  const htmlFile = await open(htmlPath, constants.O_RDONLY | constants.O_NOFOLLOW)
  let html
  try {
    const htmlStat = await htmlFile.stat({ bigint: true })
    boundedRegularFile(htmlStat, maximumHtmlBytes, htmlName)
    html = await readStableFile(htmlFile, htmlStat, maximumHtmlBytes, htmlName, 'utf8')
  } finally {
    await htmlFile.close()
  }

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

  const stylesheetFile = await open(stylesheetPath, constants.O_RDONLY | constants.O_NOFOLLOW)
  let stylesheet
  let stylesheetBytes
  try {
    const stylesheetStat = await stylesheetFile.stat({ bigint: true })
    boundedRegularFile(stylesheetStat, maximumStylesheetBytes, 'Initial stylesheet')
    stylesheetBytes = Number(stylesheetStat.size)
    stylesheet = await readStableFile(
      stylesheetFile,
      stylesheetStat,
      maximumStylesheetBytes,
      'Initial stylesheet',
      'utf8',
    )
  } finally {
    await stylesheetFile.close()
  }
  if (/<\/style/i.test(stylesheet)) throw new Error('Initial stylesheet contains an unsafe closing style tag')

  const inlined = html.replace(link, `<style data-teal-critical>${stylesheet}</style>`)
  if (inlined === html) throw new Error('Initial stylesheet link was not replaced')
  const temporaryPath = resolve(dirname(htmlPath), `.${basename(htmlPath)}.${process.pid}.tmp`)
  await writeFile(temporaryPath, inlined, { encoding: 'utf8', flag: 'wx', mode: 0o600 })
  await rename(temporaryPath, htmlPath)
  console.log(`Inlined ${stylesheetBytes} stylesheet bytes into ${htmlName}`)
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
