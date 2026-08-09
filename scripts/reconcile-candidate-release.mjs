import { execFile } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

import { validateCandidatePackage } from './publish-candidate-package.mjs'

const exec = promisify(execFile)

function validArtifact(artifact) {
  return artifact
    && artifact.name === '@kryv/teal'
    && /^0\.\d+\.\d+$/.test(artifact.version)
    && /^[0-9a-f]{40}$/.test(artifact.sourceCommit)
    && /^sha512-[A-Za-z0-9+/]{86}==$/.test(artifact.integrity)
}

export async function reconcileCandidateRelease(artifact, adapter) {
  if (!validArtifact(artifact)) throw new Error('Candidate release artifact is invalid')
  let tagCommit = await adapter.inspectTag(artifact)
  if (tagCommit === undefined || tagCommit === null) {
    await adapter.createTag(artifact)
    tagCommit = await adapter.inspectTag(artifact)
  }
  if (tagCommit !== artifact.sourceCommit) {
    throw new Error('Existing release tag conflicts with candidate source')
  }

  let release = await adapter.inspectRelease(artifact)
  if (release === undefined || release === null) {
    await adapter.createRelease(artifact)
    release = await adapter.inspectRelease(artifact)
  }
  if (
    release?.tag_name !== `v${artifact.version}`
    || release.draft !== false
    || release.prerelease !== false
  ) {
    throw new Error('Existing GitHub release conflicts with candidate')
  }
  return { release, tagCommit }
}

async function gh(repository, args) {
  return exec('gh', ['api', ...args], {
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 2 * 1024 * 1024,
  })
}

function missing(error) {
  return /HTTP 404|404 Not Found/i.test(`${error?.stderr ?? ''}\n${error?.message ?? ''}`)
}

async function optionalJson(repository, args) {
  try {
    return JSON.parse((await gh(repository, args)).stdout)
  } catch (error) {
    if (missing(error)) return undefined
    throw error
  }
}

async function inspectTag(repository, artifact) {
  let record = await optionalJson(repository, [
    `repos/${repository}/git/ref/tags/v${artifact.version}`,
  ])
  if (!record) return undefined
  for (let depth = 0; depth < 4; depth += 1) {
    if (record?.object?.type === 'commit') return record.object.sha
    if (record?.object?.type !== 'tag' || !/^[0-9a-f]{40}$/.test(record.object.sha)) {
      throw new Error('GitHub release tag target is invalid')
    }
    record = await optionalJson(repository, [
      `repos/${repository}/git/tags/${record.object.sha}`,
    ])
    if (!record) throw new Error('GitHub annotated tag target is missing')
  }
  throw new Error('GitHub release tag indirection is too deep')
}

function commandArguments(args) {
  const values = new Map()
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index]
    const value = args[index + 1]
    if (
      !['--candidate-root', '--repository', '--source-commit'].includes(name)
      || !value
      || value.startsWith('-')
      || values.has(name)
    ) {
      throw new Error('Usage: reconcile-candidate-release.mjs --candidate-root <path> --repository <owner/repository> --source-commit <commit>')
    }
    values.set(name, value)
  }
  if (values.size !== 3 || values.get('--repository') !== 'platypus27/teal') {
    throw new Error('Candidate release arguments are incomplete or untrusted')
  }
  return {
    candidateRoot: values.get('--candidate-root'),
    repository: values.get('--repository'),
    sourceCommit: values.get('--source-commit'),
  }
}

async function main() {
  const options = commandArguments(process.argv.slice(2))
  const artifact = await validateCandidatePackage({
    candidateRoot: options.candidateRoot,
    expectedSourceCommit: options.sourceCommit,
  })
  const result = await reconcileCandidateRelease(artifact, {
    inspectTag: () => inspectTag(options.repository, artifact),
    createTag: () => gh(options.repository, [
      '--method',
      'POST',
      `repos/${options.repository}/git/refs`,
      '-f',
      `ref=refs/tags/v${artifact.version}`,
      '-f',
      `sha=${artifact.sourceCommit}`,
    ]),
    inspectRelease: () => optionalJson(options.repository, [
      `repos/${options.repository}/releases/tags/v${artifact.version}`,
    ]),
    createRelease: () => gh(options.repository, [
      '--method',
      'POST',
      `repos/${options.repository}/releases`,
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
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main()
  } catch (error) {
    process.stderr.write(`Candidate release reconciliation failed: ${error.message}\n`)
    process.exitCode = 1
  }
}
