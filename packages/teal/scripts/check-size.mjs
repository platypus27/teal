import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

// Budgets in bytes for the shipped dist, measured without source maps.
// Raise them deliberately when the library genuinely grows; a failure here
// means an accidental dependency or code bloat slipped into the package.
const BUDGETS = {
  totalJs: 560_000,
  largestModule: 18_000,
  stylesCss: 75_000,
}

const distDir = new URL('../dist', import.meta.url).pathname

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

const files = walk(distDir)
const jsFiles = files.filter((file) => file.endsWith('.js'))
const totalJs = jsFiles.reduce((sum, file) => sum + statSync(file).size, 0)
const largestModule = Math.max(...jsFiles.map((file) => statSync(file).size))
const stylesCss = statSync(join(distDir, 'styles.css')).size

const failures = []
if (totalJs > BUDGETS.totalJs) {
  failures.push(`dist JS total ${totalJs} exceeds budget ${BUDGETS.totalJs}`)
}
if (largestModule > BUDGETS.largestModule) {
  failures.push(`largest dist module ${largestModule} exceeds budget ${BUDGETS.largestModule}`)
}
if (stylesCss > BUDGETS.stylesCss) {
  failures.push(`dist/styles.css ${stylesCss} exceeds budget ${BUDGETS.stylesCss}`)
}

console.log(
  `dist size: js total ${totalJs}, largest module ${largestModule}, styles.css ${stylesCss} (budgets ${BUDGETS.totalJs}/${BUDGETS.largestModule}/${BUDGETS.stylesCss})`,
)

if (failures.length > 0) {
  console.error(failures.map((line) => `over budget: ${line}`).join('\n'))
  process.exit(1)
}
