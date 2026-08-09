import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'

import { reconcileGitHubRelease } from './release-state.mjs'

const exec = promisify(execFile)
const root = resolve(import.meta.dirname, '..')

function descriptorArgument(args) {
  if (args.length !== 2 || args[0] !== '--descriptor' || args[1].startsWith('-')) {
    throw new Error('Usage: reconcile-github-release.mjs --descriptor .release/npm/artifact.json')
  }
  const path = resolve(root, args[1])
  if (!path.startsWith(`${resolve(root, '.release')}/`)) {
    throw new Error('Release descriptor must be confined beneath .release')
  }
  return path
}

async function gh(args) {
  return exec('gh', args, {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 2 * 1024 * 1024,
  })
}

function missing(error) {
  return /HTTP 404|404 Not Found/i.test(`${error?.stderr ?? ''}\n${error?.message ?? ''}`)
}

async function optionalGhJson(args) {
  try {
    return JSON.parse((await gh(args)).stdout)
  } catch (error) {
    if (missing(error)) return undefined
    throw error
  }
}

async function inspectTag(repository, artifact) {
  let record = await optionalGhJson([
    'api',
    `repos/${repository}/git/ref/tags/v${artifact.version}`,
  ])
  if (!record) return undefined
  for (let depth = 0; depth < 4; depth += 1) {
    if (record?.object?.type === 'commit') return record.object.sha
    if (record?.object?.type !== 'tag' || !/^[0-9a-f]{40}$/.test(record.object.sha)) {
      throw new Error('GitHub release tag has an invalid target')
    }
    record = await optionalGhJson([
      'api',
      `repos/${repository}/git/tags/${record.object.sha}`,
    ])
    if (!record) throw new Error('GitHub annotated tag target is missing')
  }
  throw new Error('GitHub release tag indirection is too deep')
}

try {
  const artifact = JSON.parse(await readFile(descriptorArgument(process.argv.slice(2)), 'utf8'))
  const repository = process.env.GITHUB_REPOSITORY ?? ''
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error('GITHUB_REPOSITORY is invalid')
  }
  const { stdout: headOutput } = await exec('git', ['rev-parse', '--verify', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
  })
  if (headOutput.trim() !== artifact.sourceCommit) {
    throw new Error('Release descriptor source commit does not match HEAD')
  }
  const result = await reconcileGitHubRelease(artifact, {
    inspectTag: () => inspectTag(repository, artifact),
    createTag: () => gh([
      'api',
      '--method',
      'POST',
      `repos/${repository}/git/refs`,
      '-f',
      `ref=refs/tags/v${artifact.version}`,
      '-f',
      `sha=${artifact.sourceCommit}`,
    ]),
    inspectRelease: () => optionalGhJson([
      'api',
      `repos/${repository}/releases/tags/v${artifact.version}`,
    ]),
    createRelease: () => gh([
      'api',
      '--method',
      'POST',
      `repos/${repository}/releases`,
      '-f',
      `tag_name=v${artifact.version}`,
      '-f',
      `name=v${artifact.version}`,
      '-f',
      `target_commitish=${artifact.sourceCommit}`,
      '-F',
      'draft=false',
      '-F',
      'prerelease=false',
      '-F',
      'generate_release_notes=true',
    ]),
  })
  process.stdout.write(`GitHub release ${result.release.tag_name} verified at ${result.tagCommit}\n`)
} catch (error) {
  process.stderr.write(`GitHub release reconciliation failed: ${error.message}\n`)
  process.exitCode = 1
}
