import { execFile } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'

import { decideReleaseMode } from './release-state.mjs'

const exec = promisify(execFile)
const root = resolve(import.meta.dirname, '..')

function descriptorArgument(args) {
  if (args.length !== 2 || args[0] !== '--descriptor' || args[1].startsWith('-')) {
    throw new Error('Usage: plan-release.mjs --descriptor .release/npm/artifact.json')
  }
  const path = resolve(root, args[1])
  if (!path.startsWith(`${resolve(root, '.release')}/`)) {
    throw new Error('Release descriptor must be confined beneath .release')
  }
  return path
}

async function command(commandName, args) {
  return exec(commandName, args, {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 2 * 1024 * 1024,
  })
}

function notFound(error) {
  return /\bE404\b|404 Not Found|HTTP 404|is not in this registry/i.test(
    `${error?.stderr ?? ''}\n${error?.message ?? ''}`,
  )
}

async function optionalJson(commandName, args) {
  try {
    const { stdout } = await command(commandName, args)
    return JSON.parse(stdout)
  } catch (error) {
    if (notFound(error)) return undefined
    throw error
  }
}

async function resolveTag(repository, version) {
  let record = await optionalJson('gh', [
    'api',
    `repos/${repository}/git/ref/tags/v${version}`,
  ])
  if (!record) return undefined
  for (let depth = 0; depth < 4; depth += 1) {
    if (record?.object?.type === 'commit') return record.object.sha
    if (record?.object?.type !== 'tag' || !/^[0-9a-f]{40}$/.test(record.object.sha)) {
      throw new Error('GitHub release tag has an invalid target')
    }
    record = await optionalJson('gh', [
      'api',
      `repos/${repository}/git/tags/${record.object.sha}`,
    ])
    if (!record) throw new Error('GitHub annotated tag target is missing')
  }
  throw new Error('GitHub release tag indirection is too deep')
}

try {
  const descriptorPath = descriptorArgument(process.argv.slice(2))
  const artifact = JSON.parse(await readFile(descriptorPath, 'utf8'))
  const changesets = (await readdir(resolve(root, '.changeset')))
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
  if (changesets.length > 0) {
    process.stdout.write('version\n')
  } else {
    const repository = process.env.GITHUB_REPOSITORY ?? ''
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
      throw new Error('GITHUB_REPOSITORY is invalid')
    }
    const registry = await optionalJson('npm', [
      'view',
      `${artifact.name}@${artifact.version}`,
      '--json',
    ])
    const tagCommit = await resolveTag(repository, artifact.version)
    const release = await optionalJson('gh', [
      'api',
      `repos/${repository}/releases/tags/v${artifact.version}`,
    ])
    process.stdout.write(`${decideReleaseMode({
      artifact,
      hasChangesets: false,
      registry,
      release,
      tagCommit,
    })}\n`)
  }
} catch (error) {
  process.stderr.write(`Release planning failed: ${error.message}\n`)
  process.exitCode = 1
}
