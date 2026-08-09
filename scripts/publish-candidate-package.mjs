import { execFile, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import {
  lstat,
  mkdtemp,
  open,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, posix, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { gunzipSync } from 'node:zlib'

const exec = promisify(execFile)
const validatedCandidate = Symbol('validated candidate package')
const DESCRIPTOR_FIELDS = new Set([
  'integrity',
  'name',
  'schemaVersion',
  'sourceCommit',
  'tarball',
  'tarballSha256',
  'version',
])
const MAX_DESCRIPTOR_BYTES = 64 * 1024
const MAX_TARBALL_BYTES = 256 * 1024 * 1024
const MAX_UNCOMPRESSED_BYTES = 512 * 1024 * 1024
const MAX_PACKAGE_JSON_BYTES = 1024 * 1024

async function readStableRegularFile(path, maximumBytes) {
  let handle
  try {
    handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
    const before = await handle.stat({ bigint: true })
    if (!before.isFile() || before.size < 1n || before.size > BigInt(maximumBytes)) {
      throw new Error('Candidate file is not a bounded regular file')
    }
    const chunks = []
    for await (const chunk of handle.createReadStream({ autoClose: false })) chunks.push(chunk)
    const after = await handle.stat({ bigint: true })
    if (
      before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
    ) {
      throw new Error('Candidate file changed while it was read')
    }
    return Buffer.concat(chunks)
  } finally {
    await handle?.close()
  }
}

function exactDescriptor(bytes) {
  let descriptor
  try {
    descriptor = JSON.parse(bytes.toString('utf8'))
  } catch {
    throw new Error('Candidate package descriptor is invalid JSON')
  }
  if (
    !descriptor
    || Array.isArray(descriptor)
    || typeof descriptor !== 'object'
    || Object.keys(descriptor).length !== DESCRIPTOR_FIELDS.size
    || Object.keys(descriptor).some((field) => !DESCRIPTOR_FIELDS.has(field))
  ) {
    throw new Error('Candidate package descriptor fields are invalid')
  }
  if (
    descriptor.schemaVersion !== 1
    || descriptor.name !== '@kryv/teal'
    || !/^0\.\d+\.\d+$/.test(descriptor.version)
    || !/^[0-9a-f]{40}$/.test(descriptor.sourceCommit)
    || !/^sha512-[A-Za-z0-9+/]{86}==$/.test(descriptor.integrity)
    || !/^sha256:[0-9a-f]{64}$/.test(descriptor.tarballSha256)
    || descriptor.tarball !== `kryv-teal-${descriptor.version}.tgz`
  ) {
    throw new Error('Candidate package descriptor is invalid')
  }
  return descriptor
}

function octal(header, start, length, label) {
  const value = header.subarray(start, start + length).toString('ascii').replace(/\0.*$/s, '').trim()
  if (!/^[0-7]+$/.test(value)) throw new Error(`Candidate archive ${label} is invalid`)
  const parsed = Number.parseInt(value, 8)
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`Candidate archive ${label} is invalid`)
  }
  return parsed
}

function tarString(header, start, length) {
  const field = header.subarray(start, start + length)
  const end = field.indexOf(0)
  const bytes = end === -1 ? field : field.subarray(0, end)
  const value = bytes.toString('utf8')
  if (!Buffer.from(value).equals(bytes) || /[\x00-\x1f\x7f\\]/.test(value)) {
    throw new Error('Candidate archive path is invalid')
  }
  return value
}

function safeArchivePath(path) {
  const normalized = path.endsWith('/') ? path.slice(0, -1) : path
  if (
    !normalized
    || posix.isAbsolute(normalized)
    || posix.normalize(normalized) !== normalized
    || (normalized !== 'package' && !normalized.startsWith('package/'))
    || normalized.split('/').some((segment) => !segment || segment === '.' || segment === '..')
  ) {
    throw new Error(`Candidate archive path is unsafe: ${path}`)
  }
  return normalized
}

function parsePackageArchive(compressed) {
  let archive
  try {
    archive = gunzipSync(compressed, { maxOutputLength: MAX_UNCOMPRESSED_BYTES })
  } catch (error) {
    throw new Error(`Candidate package archive gzip is invalid: ${error.message}`)
  }
  const seen = new Set()
  let packageJsonBytes
  let offset = 0
  let ended = false
  while (offset + 512 <= archive.length) {
    const header = archive.subarray(offset, offset + 512)
    if (header.every((byte) => byte === 0)) {
      ended = true
      break
    }
    const storedChecksum = octal(header, 148, 8, 'checksum')
    let actualChecksum = 0
    for (let index = 0; index < header.length; index += 1) {
      actualChecksum += index >= 148 && index < 156 ? 0x20 : header[index]
    }
    if (storedChecksum !== actualChecksum) throw new Error('Candidate archive checksum is invalid')
    const name = tarString(header, 0, 100)
    const prefix = tarString(header, 345, 155)
    const path = safeArchivePath(prefix ? `${prefix}/${name}` : name)
    if (seen.has(path)) throw new Error(`Candidate archive contains a duplicate path: ${path}`)
    seen.add(path)
    const size = octal(header, 124, 12, 'entry size')
    const type = header[156]
    if (![0, 0x30, 0x35].includes(type)) {
      throw new Error(`Candidate archive entry type is forbidden for ${path}`)
    }
    if (type === 0x35 && size !== 0) throw new Error(`Candidate archive directory has content: ${path}`)
    const bodyStart = offset + 512
    const bodyEnd = bodyStart + size
    if (bodyEnd > archive.length) throw new Error(`Candidate archive entry is truncated: ${path}`)
    if (path === 'package/package.json') {
      if (![0, 0x30].includes(type) || size < 1 || size > MAX_PACKAGE_JSON_BYTES) {
        throw new Error('Candidate archive package.json is invalid')
      }
      packageJsonBytes = archive.subarray(bodyStart, bodyEnd)
    }
    offset = bodyStart + Math.ceil(size / 512) * 512
  }
  if (!ended || archive.subarray(offset).some((byte) => byte !== 0)) {
    throw new Error('Candidate package archive has invalid trailing bytes')
  }
  if (!packageJsonBytes) throw new Error('Candidate package archive lacks package/package.json')
  let packageJson
  try {
    packageJson = JSON.parse(packageJsonBytes.toString('utf8'))
  } catch {
    throw new Error('Candidate archive package.json is invalid JSON')
  }
  return packageJson
}

export async function validateCandidatePackage({ candidateRoot, expectedSourceCommit }) {
  if (!/^[0-9a-f]{40}$/.test(expectedSourceCommit)) {
    throw new Error('Expected source commit is invalid')
  }
  const root = resolve(candidateRoot)
  const metadata = await lstat(root)
  if (!metadata.isDirectory() || metadata.isSymbolicLink() || await realpath(root) !== root) {
    throw new Error('Candidate package root must be a canonical directory')
  }
  const npmRoot = join(root, 'npm')
  const descriptorBytes = await readStableRegularFile(
    join(npmRoot, 'artifact.json'),
    MAX_DESCRIPTOR_BYTES,
  )
  const descriptor = exactDescriptor(descriptorBytes)
  if (descriptor.sourceCommit !== expectedSourceCommit) {
    throw new Error('Candidate package source commit mismatch')
  }
  const tarballPath = join(npmRoot, descriptor.tarball)
  const tarball = await readStableRegularFile(tarballPath, MAX_TARBALL_BYTES)
  const tarballSha256 = `sha256:${createHash('sha256').update(tarball).digest('hex')}`
  if (tarballSha256 !== descriptor.tarballSha256) {
    throw new Error('Candidate package tarball digest mismatch')
  }
  const integrity = `sha512-${createHash('sha512').update(tarball).digest('base64')}`
  if (integrity !== descriptor.integrity) {
    throw new Error('Candidate package tarball integrity mismatch')
  }
  const packageJson = parsePackageArchive(tarball)
  if (
    packageJson?.name !== descriptor.name
    || packageJson.version !== descriptor.version
    || packageJson.gitHead !== descriptor.sourceCommit
  ) {
    throw new Error('Candidate archive package identity mismatch')
  }
  return {
    ...descriptor,
    packageJson,
    tarballPath,
    [validatedCandidate]: true,
  }
}

function assertRegistryArtifact(artifact, registry) {
  if (registry?.name !== artifact.name) throw new Error('Registry package name mismatch')
  if (registry?.version !== artifact.version) throw new Error('Registry package version mismatch')
  if (registry?.gitHead !== artifact.sourceCommit) throw new Error('Registry package source commit mismatch')
  if (registry?.dist?.integrity !== artifact.integrity) {
    throw new Error('Registry package integrity mismatch')
  }
  let attestation
  try {
    attestation = new URL(registry.dist.attestations.url)
  } catch {
    throw new Error('Registry package provenance is missing')
  }
  let attestedPackage
  try {
    attestedPackage = decodeURIComponent(
      attestation.pathname.slice('/-/npm/v1/attestations/'.length),
    )
  } catch {
    throw new Error('Registry package provenance is invalid')
  }
  if (
    attestation.origin !== 'https://registry.npmjs.org'
    || attestation.username
    || attestation.password
    || attestation.search
    || attestation.hash
    || !attestation.pathname.startsWith('/-/npm/v1/attestations/')
    || attestedPackage !== `${artifact.name}@${artifact.version}`
    || registry.dist.attestations.provenance?.predicateType !== 'https://slsa.dev/provenance/v1'
  ) {
    throw new Error('Registry package provenance is invalid')
  }
}

function canonicalBase64(value, label) {
  if (
    typeof value !== 'string'
    || value.length === 0
    || value.length % 4 !== 0
    || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)
  ) {
    throw new Error(`${label} is invalid`)
  }
  const bytes = Buffer.from(value, 'base64')
  if (bytes.toString('base64') !== value) throw new Error(`${label} is invalid`)
  return bytes
}

export function assertVerifiedRegistryProvenance({
  artifact,
  auditReport,
  publicationRunAttempt,
  publicationRunId,
  requireCurrentInvocation = true,
}) {
  const fail = () => {
    throw new Error('npm-verified provenance does not match the exact protected publication')
  }
  if (
    !/^[1-9][0-9]{0,19}$/.test(publicationRunId)
    || !Number.isSafeInteger(publicationRunAttempt)
    || publicationRunAttempt < 1
    || publicationRunAttempt > 1000
    || typeof requireCurrentInvocation !== 'boolean'
    || !Array.isArray(auditReport?.invalid)
    || auditReport.invalid.length !== 0
    || !Array.isArray(auditReport?.missing)
    || auditReport.missing.length !== 0
    || !Array.isArray(auditReport?.verified)
  ) {
    fail()
  }
  const packages = auditReport.verified.filter((entry) => (
    entry?.name === artifact.name && entry.version === artifact.version
  ))
  if (packages.length !== 1) fail()
  const verified = packages[0]
  if (
    verified.registry !== 'https://registry.npmjs.org/'
    || verified.attestations?.provenance?.predicateType !== 'https://slsa.dev/provenance/v1'
    || !Array.isArray(verified.attestationBundles)
  ) {
    fail()
  }
  try {
    const attestation = new URL(verified.attestations.url)
    const attestedPackage = decodeURIComponent(
      attestation.pathname.slice('/-/npm/v1/attestations/'.length),
    )
    if (
      attestation.origin !== 'https://registry.npmjs.org'
      || attestation.search
      || attestation.hash
      || !attestation.pathname.startsWith('/-/npm/v1/attestations/')
      || attestedPackage !== `${artifact.name}@${artifact.version}`
    ) {
      fail()
    }
  } catch {
    fail()
  }
  const provenance = verified.attestationBundles.filter((entry) => (
    entry?.predicateType === 'https://slsa.dev/provenance/v1'
  ))
  if (provenance.length !== 1) fail()
  let statement
  try {
    statement = JSON.parse(canonicalBase64(
      provenance[0].bundle?.dsseEnvelope?.payload,
      'npm provenance statement',
    ).toString('utf8'))
  } catch {
    fail()
  }
  const expectedSha512 = Buffer.from(
    artifact.integrity.slice('sha512-'.length),
    'base64',
  ).toString('hex')
  const build = statement?.predicate?.buildDefinition
  const run = statement?.predicate?.runDetails
  const workflow = build?.externalParameters?.workflow
  const invocationId = run?.metadata?.invocationId
  const invocation = typeof invocationId === 'string'
    ? invocationId.match(/^https:\/\/github\.com\/platypus27\/teal\/actions\/runs\/([1-9][0-9]{0,19})\/attempts\/([1-9][0-9]{0,2})$/)
    : null
  const invocationAttempt = invocation ? Number(invocation[2]) : 0
  if (
    statement?._type !== 'https://in-toto.io/Statement/v1'
    || statement.predicateType !== 'https://slsa.dev/provenance/v1'
    || !Array.isArray(statement.subject)
    || statement.subject.length !== 1
    || statement.subject[0]?.name !== `pkg:npm/%40kryv/teal@${artifact.version}`
    || statement.subject[0]?.digest?.sha512 !== expectedSha512
    || build?.buildType !== 'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1'
    || workflow?.ref !== 'refs/heads/master'
    || workflow.repository !== 'https://github.com/platypus27/teal'
    || workflow.path !== '.github/workflows/protected-release.yml'
    || build?.internalParameters?.github?.event_name !== 'workflow_dispatch'
    || !Array.isArray(build?.resolvedDependencies)
    || build.resolvedDependencies.length !== 1
    || build.resolvedDependencies[0]?.uri !== 'git+https://github.com/platypus27/teal@refs/heads/master'
    || build.resolvedDependencies[0]?.digest?.gitCommit !== artifact.sourceCommit
    || run?.builder?.id !== 'https://github.com/actions/runner/github-hosted'
    || !invocation
    || invocationAttempt < 1
    || invocationAttempt > 1000
    || (
      requireCurrentInvocation
      && invocationId !== `https://github.com/platypus27/teal/actions/runs/${publicationRunId}/attempts/${publicationRunAttempt}`
    )
  ) {
    fail()
  }
}

export async function publishOrVerifyCandidatePackage(artifact, adapter, {
  recoveryOnly = false,
} = {}) {
  if (artifact?.[validatedCandidate] !== true) {
    throw new Error('Candidate package was not validated')
  }
  let registry = await adapter.inspect(artifact)
  let published = false
  if (typeof recoveryOnly !== 'boolean') {
    throw new Error('Candidate package recovery policy is invalid')
  }
  if (recoveryOnly && (registry === undefined || registry === null)) {
    throw new Error('Durable recovery cannot publish an absent candidate package')
  }
  if (!recoveryOnly && registry !== undefined && registry !== null) {
    throw new Error('Existing candidate package requires durable recovery authorization')
  }
  if (registry === undefined || registry === null) {
    await adapter.publish(artifact)
    published = true
    registry = await adapter.inspect(artifact)
    if (registry === undefined || registry === null) {
      throw new Error('Published candidate package did not become visible')
    }
  }
  assertRegistryArtifact(artifact, registry)
  if (typeof adapter.verifyProvenance !== 'function') {
    throw new Error('Registry cryptographic provenance verifier is required')
  }
  await adapter.verifyProvenance(artifact, registry, {
    requireCurrentInvocation: published,
  })
  return { published, registry }
}

async function command(commandName, args, {
  cwd,
  env = process.env,
  inherit = false,
  maxBuffer = 2 * 1024 * 1024,
  timeout = 120_000,
} = {}) {
  if (inherit) {
    await new Promise((resolveCommand, reject) => {
      const child = spawn(commandName, args, { cwd, env, stdio: 'inherit' })
      child.on('error', reject)
      child.on('exit', (code, signal) => {
        if (code === 0) resolveCommand()
        else reject(new Error(`${commandName} exited with ${signal ? `signal ${signal}` : `code ${code}`}`))
      })
    })
    return ''
  }
  return (await exec(commandName, args, {
    cwd,
    encoding: 'utf8',
    env,
    maxBuffer,
    timeout,
  })).stdout
}

function publicRegistryEnvironment(root) {
  const env = {}
  for (const [name, value] of Object.entries(process.env)) {
    if (
      value !== undefined
      && !/^npm_config_/i.test(name)
      && !/^(?:GH|GITHUB|NODE_AUTH|NPM)_TOKEN$/i.test(name)
    ) {
      env[name] = value
    }
  }
  return {
    ...env,
    NPM_CONFIG_AUDIT: 'false',
    NPM_CONFIG_CACHE: join(root, '.npm-cache'),
    NPM_CONFIG_FUND: 'false',
    NPM_CONFIG_IGNORE_SCRIPTS: 'true',
    NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org/',
    NPM_CONFIG_USERCONFIG: '/dev/null',
  }
}

async function verifyRegistryProvenance({
  artifact,
  publicationRunAttempt,
  publicationRunId,
  requireCurrentInvocation,
}) {
  const root = await mkdtemp(join(tmpdir(), 'teal-npm-provenance-'))
  const env = publicRegistryEnvironment(root)
  try {
    await writeFile(join(root, 'package.json'), `${JSON.stringify({
      name: 'teal-provenance-verifier',
      version: '0.0.0',
      private: true,
      dependencies: { [artifact.name]: artifact.version },
    }, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
    await command('npm', [
      'install',
      '--package-lock-only',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
    ], { cwd: root, env, timeout: 300_000 })
    await command('npm', [
      'ci',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
    ], { cwd: root, env, timeout: 300_000 })
    const auditReport = JSON.parse(await command('npm', [
      'audit',
      'signatures',
      '--json',
      '--include-attestations',
    ], {
      cwd: root,
      env,
      maxBuffer: 32 * 1024 * 1024,
      timeout: 300_000,
    }))
    assertVerifiedRegistryProvenance({
      artifact,
      auditReport,
      publicationRunAttempt,
      publicationRunId,
      requireCurrentInvocation,
    })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

async function inspectRegistry(artifact) {
  try {
    return JSON.parse(await command('npm', ['view', `${artifact.name}@${artifact.version}`, '--json']))
  } catch (error) {
    if (/\bE404\b|404 Not Found|is not in this registry/i.test(`${error?.stderr ?? ''}\n${error?.message ?? ''}`)) {
      return undefined
    }
    throw error
  }
}

function argumentsForMain(args) {
  let recoveryOnly = false
  if (args.at(-1) === '--recovery-only') {
    recoveryOnly = true
    args = args.slice(0, -1)
  }
  const values = new Map()
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index]
    const value = args[index + 1]
    if (
      ![
        '--candidate-root',
        '--publication-run-attempt',
        '--publication-run-id',
        '--source-commit',
      ].includes(name)
      || !value
      || value.startsWith('-')
      || values.has(name)
    ) {
      throw new Error('Usage: publish-candidate-package.mjs --candidate-root <path> --publication-run-id <id> --publication-run-attempt <attempt> --source-commit <commit>')
    }
    values.set(name, value)
  }
  const publicationRunId = values.get('--publication-run-id')
  const publicationRunAttempt = Number(values.get('--publication-run-attempt'))
  if (
    values.size !== 4
    || !/^[1-9][0-9]{0,19}$/.test(publicationRunId ?? '')
    || !Number.isSafeInteger(publicationRunAttempt)
    || publicationRunAttempt < 1
    || publicationRunAttempt > 1000
  ) {
    throw new Error('Candidate package arguments are incomplete or invalid')
  }
  return {
    candidateRoot: values.get('--candidate-root'),
    expectedSourceCommit: values.get('--source-commit'),
    publicationRunAttempt,
    publicationRunId,
    recoveryOnly,
  }
}

async function main() {
  if (process.version !== 'v24.19.0') throw new Error('Candidate publication requires Node v24.19.0')
  const npmVersion = (await command('npm', ['--version'], { timeout: 10_000 })).trim()
  if (npmVersion !== '11.19.0') throw new Error('Candidate publication requires npm 11.19.0')
  const options = argumentsForMain(process.argv.slice(2))
  const artifact = await validateCandidatePackage(options)
  const result = await publishOrVerifyCandidatePackage(artifact, {
    inspect: inspectRegistry,
    publish: (candidate) => command('npm', [
      'publish',
      candidate.tarballPath,
      '--access',
      'public',
      '--provenance',
    ], { inherit: true }),
    verifyProvenance: (candidate, _registry, context) => verifyRegistryProvenance({
      artifact: candidate,
      publicationRunAttempt: options.publicationRunAttempt,
      publicationRunId: options.publicationRunId,
      requireCurrentInvocation: context.requireCurrentInvocation,
    }),
  }, { recoveryOnly: options.recoveryOnly })
  process.stdout.write(`${result.published ? 'Published' : 'Verified'} ${artifact.name}@${artifact.version}\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main()
  } catch (error) {
    process.stderr.write(`Candidate package publication failed: ${error.message}\n`)
    process.exitCode = 1
  }
}
