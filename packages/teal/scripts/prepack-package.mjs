import { execFile } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { assertPackedFiles } from './package-contract.mjs'

const exec = promisify(execFile)
const packageRoot = new URL('..', import.meta.url).pathname
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))

async function listRegularFiles(root, relative = '') {
  const files = []
  for (const entry of await readdir(join(root, relative), { withFileTypes: true })) {
    const path = relative ? `${relative}/${entry.name}` : entry.name
    if (entry.isDirectory()) files.push(...await listRegularFiles(root, path))
    else if (entry.isFile()) files.push(path)
    else throw new Error(`Package build contains a non-regular file: ${path}`)
  }
  return files.sort()
}

await exec(process.execPath, [join(packageRoot, 'scripts/build.mjs')], {
  cwd: packageRoot,
  env: process.env,
  maxBuffer: 20 * 1024 * 1024,
})
const { stdout } = await exec('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], {
  cwd: packageRoot,
  env: process.env,
  maxBuffer: 20 * 1024 * 1024,
})
const manifests = JSON.parse(stdout)
if (!Array.isArray(manifests) || manifests.length !== 1) {
  throw new Error('Expected one npm dry-run pack manifest')
}
assertPackedFiles({
  packageJson,
  packedFiles: manifests[0].files.map((file) => file.path),
  builtDistFiles: await listRegularFiles(packageRoot, 'dist'),
})
