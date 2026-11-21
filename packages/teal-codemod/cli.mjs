#!/usr/bin/env node
import { realpathSync } from 'node:fs'
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { migrateSource } from './index.mjs'

// Dependency, VCS and build output directories are never application sources;
// they are skipped while walking, but still processed when named explicitly.
const skippedDirectories = new Set(['node_modules', '.git', 'dist', 'build', 'coverage'])

async function collectFiles(target) {
  const stats = await stat(target)
  if (stats.isDirectory()) {
    const entries = await readdir(target, { withFileTypes: true })
    const walked = entries
      .filter((entry) => !(entry.isDirectory() && skippedDirectories.has(entry.name)))
      .map((entry) => collectFiles(join(target, entry.name)))
    return (await Promise.all(walked)).flat()
  }
  return ['.tsx', '.ts', '.jsx', '.js'].includes(extname(target)) ? [target] : []
}

async function main(argv) {
  if (argv.length === 0) {
    console.error('Usage: teal-codemod <file-or-directory>...')
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

// npm bin links start the CLI through a symlink, so compare real paths.
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  await main(process.argv.slice(2))
}
