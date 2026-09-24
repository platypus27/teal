import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import process from 'node:process'
import { migrateSource } from './index.mjs'

async function collectFiles(target) {
  const stats = await stat(target)
  if (stats.isDirectory()) {
    const entries = await readdir(target)
    return (await Promise.all(entries.map((entry) => collectFiles(join(target, entry))))).flat()
  }
  return ['.tsx', '.ts', '.jsx', '.js'].includes(extname(target)) ? [target] : []
}

async function main(argv) {
  if (argv.length === 0) {
    console.error('Usage: npx @kryv/teal-codemod <file-or-directory>...')
    process.exit(1)
  }
  const files = (await Promise.all(argv.map((arg) => collectFiles(resolve(arg))))).flat()
  let touched = 0
  for (const file of files) {
    const source = await readFile(file, 'utf8')
    const { code, warnings } = migrateSource(source)
    if (code !== source) {
      await writeFile(file, code)
      touched += 1
    }
    for (const warning of warnings) console.warn(`${file}: ${warning}`)
  }
  console.log(`teal-codemod: rewrote ${touched} of ${files.length} file(s)`)
}

if (process.argv[1] !== undefined && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  await main(process.argv.slice(2))
}
