import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..')

// Changesets publishes every workspace package that is not marked private, so
// this list is the full set of packages the release job may put on npm.
const publishedPackages = ['@kryv/teal']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function workspacePackages() {
  const { workspaces } = readJson(join(repoRoot, 'package.json'))
  return workspaces.flatMap((pattern) => {
    if (!pattern.endsWith('/*')) throw new Error(`Unsupported workspace pattern: ${pattern}`)
    const parent = join(repoRoot, pattern.slice(0, -2))
    return readdirSync(parent, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(parent, entry.name, 'package.json'))
      .flatMap((path) => {
        try {
          return [{ path, manifest: readJson(path) }]
        } catch (error) {
          if (error.code === 'ENOENT') return []
          throw error
        }
      })
  })
}

describe('release packages', () => {
  it('only leaves the published packages non-private', () => {
    const packages = workspacePackages()
    expect(packages.map(({ manifest }) => manifest.name)).toContain('@kryv/teal-codemod')

    const publishable = packages
      .filter(({ manifest }) => manifest.private !== true)
      .map(({ manifest }) => manifest.name)
      .sort()
    expect(publishable).toEqual(publishedPackages)
  })

  it('does not carry npm publish settings on private packages', () => {
    const misconfigured = workspacePackages()
      .filter(({ manifest }) => manifest.private === true && manifest.publishConfig !== undefined)
      .map(({ manifest }) => manifest.name)
    expect(misconfigured).toEqual([])
  })

  it('does not tell consumers to install the unpublished codemod from npm', () => {
    const sources = [
      'apps/docs/src/data/getting-started.js',
      'packages/teal-codemod/README.md',
      'packages/teal-codemod/cli.mjs',
    ]
    for (const source of sources) {
      expect(readFileSync(join(repoRoot, source), 'utf8'), source).not.toMatch(
        /np[mx]\s+(?:exec\s+)?(?:install\s+|i\s+|add\s+)?(?:-\S+\s+)*@kryv\/teal-codemod/,
      )
    }
  })
})
