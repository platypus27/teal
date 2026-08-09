import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import { lstat, open, readdir, realpath, unlink, writeFile } from 'node:fs/promises'
import { isAbsolute, join, posix, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const TRIVY_VERSION = '0.73.0'
const CANDIDATE_FIELDS = new Set([
  'createdAt',
  'files',
  'ref',
  'repository',
  'schemaVersion',
  'sourceCommit',
  'sourceRunAttempt',
  'sourceRunId',
  'workflow',
])
const FILE_FIELDS = new Set(['bytes', 'path', 'sha256'])
const REQUIRED_CANDIDATE_PATHS = new Set([
  'controller/kryv-teal-production-controller.tar',
  'deploy.docs.yml',
  'docs/artifact.json',
  'docs/docs-image.sbom.cdx.json',
  'docs/docs-image.secret.json',
  'docs/docs-image.tar',
  'docs/docs-image.vulnerability.json',
  'infra/release-owner-approval.json',
  'npm/artifact.json',
  'runtime/owner-approval.mjs',
  'runtime/publish-candidate-package.mjs',
  'runtime/reconcile-candidate-release.mjs',
  'runtime/teal_release_candidate.mjs',
  'runtime/teal_owner_authority.mjs',
  'runtime/verify-owner-approval.mjs',
  'source/repository.bundle',
])
const MAX_CANDIDATE_BYTES = 8 * 1024 * 1024 * 1024

export function sha256Bytes(bytes) {
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`
}

function exactFields(value, fields, label) {
  if (
    !value
    || Array.isArray(value)
    || typeof value !== 'object'
    || Object.keys(value).length !== fields.size
    || Object.keys(value).some((field) => !fields.has(field))
  ) {
    throw new Error(`${label} fields are invalid`)
  }
}

function safeCandidatePath(path) {
  if (
    typeof path !== 'string'
    || path.length === 0
    || path.length > 240
    || /[\x00-\x1f\x7f]/.test(path)
    || path.includes('\\')
    || isAbsolute(path)
    || posix.normalize(path) !== path
    || path.split('/').some((segment) => !segment || segment === '.' || segment === '..')
    || path === 'candidate-manifest.json'
  ) {
    throw new Error(`Candidate file path is invalid: ${String(path)}`)
  }
  return path
}

function normalizeCandidateManifest(manifest) {
  exactFields(manifest, CANDIDATE_FIELDS, 'Candidate manifest')
  if (manifest.schemaVersion !== 1) throw new Error('Candidate schemaVersion is invalid')
  if (manifest.repository !== 'platypus27/teal') throw new Error('Candidate repository is invalid')
  if (manifest.workflow !== 'platypus27/teal/.github/workflows/pipeline.yml') {
    throw new Error('Candidate workflow is invalid')
  }
  if (manifest.ref !== 'refs/heads/master') throw new Error('Candidate ref is invalid')
  if (!/^[0-9a-f]{40}$/.test(manifest.sourceCommit)) {
    throw new Error('Candidate sourceCommit is invalid')
  }
  if (!/^[1-9][0-9]{0,19}$/.test(manifest.sourceRunId)) {
    throw new Error('Candidate sourceRunId is invalid')
  }
  if (
    !Number.isSafeInteger(manifest.sourceRunAttempt)
    || manifest.sourceRunAttempt < 1
    || manifest.sourceRunAttempt > 1000
  ) {
    throw new Error('Candidate sourceRunAttempt is invalid')
  }
  const createdAt = new Date(manifest.createdAt)
  if (!Number.isFinite(createdAt.getTime()) || createdAt.toISOString() !== manifest.createdAt) {
    throw new Error('Candidate createdAt is invalid')
  }
  if (!Array.isArray(manifest.files)) throw new Error('Candidate files are invalid')

  const seen = new Set()
  let totalBytes = 0
  const files = manifest.files.map((file) => {
    exactFields(file, FILE_FIELDS, 'Candidate file')
    const path = safeCandidatePath(file.path)
    if (seen.has(path)) throw new Error(`Candidate file path is duplicate: ${path}`)
    seen.add(path)
    if (!Number.isSafeInteger(file.bytes) || file.bytes < 1) {
      throw new Error(`Candidate file bytes are invalid: ${path}`)
    }
    if (!/^sha256:[0-9a-f]{64}$/.test(file.sha256)) {
      throw new Error(`Candidate file sha256 is invalid: ${path}`)
    }
    totalBytes += file.bytes
    if (!Number.isSafeInteger(totalBytes) || totalBytes > MAX_CANDIDATE_BYTES) {
      throw new Error('Candidate file closure is too large')
    }
    return { path, bytes: file.bytes, sha256: file.sha256 }
  }).sort((left, right) => left.path.localeCompare(right.path))

  for (const path of REQUIRED_CANDIDATE_PATHS) {
    if (!seen.has(path)) throw new Error(`Candidate file closure is missing ${path}`)
  }
  const tarballs = files.filter(({ path }) => /^npm\/kryv-teal-0\.\d+\.\d+\.tgz$/.test(path))
  if (tarballs.length !== 1) {
    throw new Error('Candidate file closure must contain one exact npm tarball')
  }
  if (seen.size !== REQUIRED_CANDIDATE_PATHS.size + 1) {
    throw new Error('Candidate file closure contains an unexpected path')
  }

  return {
    schemaVersion: 1,
    repository: manifest.repository,
    workflow: manifest.workflow,
    ref: manifest.ref,
    sourceCommit: manifest.sourceCommit,
    sourceRunId: manifest.sourceRunId,
    sourceRunAttempt: manifest.sourceRunAttempt,
    createdAt: createdAt.toISOString(),
    files,
  }
}

export function canonicalCandidateManifest(manifest) {
  return Buffer.from(`${JSON.stringify(normalizeCandidateManifest(manifest), null, 2)}\n`)
}

async function regularFileDigest(path, expectedBytes) {
  let handle
  try {
    handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
    const before = await handle.stat({ bigint: true })
    if (!before.isFile() || before.size !== BigInt(expectedBytes)) {
      throw new Error('Candidate file byte count mismatch')
    }
    const hash = createHash('sha256')
    for await (const chunk of handle.createReadStream({ autoClose: false })) hash.update(chunk)
    const after = await handle.stat({ bigint: true })
    if (
      before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
    ) {
      throw new Error('Candidate file changed during verification')
    }
    return `sha256:${hash.digest('hex')}`
  } finally {
    await handle?.close()
  }
}

async function candidatePaths(root, relativePath = '') {
  const paths = []
  const directory = join(root, relativePath)
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = relativePath ? `${relativePath}/${entry.name}` : entry.name
    const metadata = await lstat(join(root, path))
    if (metadata.isSymbolicLink()) {
      throw new Error(`Candidate entry must be a regular file or directory: ${path}`)
    }
    if (metadata.isDirectory()) {
      paths.push(...await candidatePaths(root, path))
    } else if (metadata.isFile()) {
      paths.push(path)
    } else {
      throw new Error(`Candidate entry must be a regular file or directory: ${path}`)
    }
  }
  return paths.sort()
}

export async function verifyCandidateDirectory({ expectedContext, manifestBytes, root }) {
  if (!Buffer.isBuffer(manifestBytes) || manifestBytes.length === 0 || manifestBytes.length > 1024 * 1024) {
    throw new Error('Candidate manifest bytes are invalid')
  }
  let parsed
  try {
    parsed = JSON.parse(manifestBytes.toString('utf8'))
  } catch {
    throw new Error('Candidate manifest is invalid JSON')
  }
  const canonical = canonicalCandidateManifest(parsed)
  if (!canonical.equals(manifestBytes)) throw new Error('Candidate manifest is not canonical')
  const manifest = normalizeCandidateManifest(parsed)
  for (const field of [
    'repository',
    'workflow',
    'ref',
    'sourceCommit',
    'sourceRunId',
    'sourceRunAttempt',
  ]) {
    if (manifest[field] !== expectedContext?.[field]) {
      throw new Error(`Candidate ${field} mismatch`)
    }
  }

  const absoluteRoot = resolve(root)
  const rootMetadata = await lstat(absoluteRoot)
  if (!rootMetadata.isDirectory() || rootMetadata.isSymbolicLink() || await realpath(absoluteRoot) !== absoluteRoot) {
    throw new Error('Candidate root must be a canonical directory')
  }
  const actualPaths = await candidatePaths(absoluteRoot)
  const expectedPaths = ['candidate-manifest.json', ...manifest.files.map(({ path }) => path)].sort()
  if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error('Candidate file closure does not match the manifest')
  }
  const manifestDigest = await regularFileDigest(
    join(absoluteRoot, 'candidate-manifest.json'),
    manifestBytes.length,
  )
  if (manifestDigest !== sha256Bytes(manifestBytes)) {
    throw new Error('Candidate manifest file digest mismatch')
  }
  for (const file of manifest.files) {
    const absolutePath = resolve(absoluteRoot, file.path)
    if (relative(absoluteRoot, absolutePath).startsWith('..')) {
      throw new Error(`Candidate file escapes the root: ${file.path}`)
    }
    const digest = await regularFileDigest(absolutePath, file.bytes)
    if (digest !== file.sha256) {
      throw new Error(`Candidate file digest mismatch: ${file.path}`)
    }
  }
  const finalPaths = await candidatePaths(absoluteRoot)
  if (JSON.stringify(finalPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error('Candidate file closure changed during verification')
  }
  return {
    manifest,
    manifestSha256: sha256Bytes(manifestBytes),
  }
}

export async function createCandidateManifest({ context, root }) {
  const absoluteRoot = resolve(root)
  const rootMetadata = await lstat(absoluteRoot)
  if (!rootMetadata.isDirectory() || rootMetadata.isSymbolicLink() || await realpath(absoluteRoot) !== absoluteRoot) {
    throw new Error('Candidate root must be a canonical directory')
  }
  const paths = await candidatePaths(absoluteRoot)
  if (paths.includes('candidate-manifest.json')) {
    throw new Error('Candidate manifest already exists')
  }
  const files = []
  for (const path of paths) {
    const metadata = await lstat(join(absoluteRoot, path))
    if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size < 1) {
      throw new Error(`Candidate entry must be a non-empty regular file: ${path}`)
    }
    files.push({
      path,
      bytes: metadata.size,
      sha256: await regularFileDigest(join(absoluteRoot, path), metadata.size),
    })
  }
  const manifestBytes = canonicalCandidateManifest({
    schemaVersion: 1,
    repository: context?.repository,
    workflow: context?.workflow,
    ref: context?.ref,
    sourceCommit: context?.sourceCommit,
    sourceRunId: context?.sourceRunId,
    sourceRunAttempt: context?.sourceRunAttempt,
    createdAt: context?.createdAt,
    files,
  })
  const manifestPath = join(absoluteRoot, 'candidate-manifest.json')
  let created = false
  try {
    await writeFile(manifestPath, manifestBytes, { flag: 'wx', mode: 0o444 })
    created = true
    const verified = await verifyCandidateDirectory({
      expectedContext: context,
      manifestBytes,
      root: absoluteRoot,
    })
    return verified
  } catch (error) {
    if (created) await unlink(manifestPath)
    throw error
  }
}

export function parseJsonEvidence(bytes, label) {
  let value
  try {
    value = JSON.parse(bytes.toString('utf8'))
  } catch {
    throw new Error(`${label} is not valid JSON`)
  }
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    throw new Error(`${label} is not a JSON object`)
  }
  return value
}

export function exactScanReceipt({
  archiveSha256,
  imageId,
  rawBytes,
  repository,
  scanType,
  sourceCommit,
}) {
  if (!['secret', 'vulnerability'].includes(scanType)) {
    throw new Error('scanType is invalid')
  }
  if (!/^sha256:[0-9a-f]{64}$/.test(archiveSha256)) {
    throw new Error('archiveSha256 is invalid')
  }
  if (!/^sha256:[0-9a-f]{64}$/.test(imageId)) {
    throw new Error('imageId is invalid')
  }
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) {
    throw new Error('sourceCommit is invalid')
  }
  if (!/^ghcr\.io\/[a-z0-9_.-]+\/[a-z0-9_.\/-]+$/.test(repository)) {
    throw new Error('repository is invalid')
  }
  const report = parseJsonEvidence(rawBytes, `${scanType} scan report`)
  if (report.SchemaVersion !== 2 || !Array.isArray(report.Results)) {
    throw new Error(`${scanType} scan report has an invalid Trivy schema`)
  }
  if (report.ArtifactType !== 'container_image' || report.Metadata?.ImageID !== imageId) {
    throw new Error(`${scanType} scan report image identity is invalid`)
  }
  const canonicalReport = Buffer.from(`${JSON.stringify(report, null, 2)}\n`)
  return {
    schemaVersion: 1,
    status: 'passed',
    scanType,
    scanner: {
      name: 'trivy',
      version: TRIVY_VERSION,
    },
    sourceCommit,
    repository,
    imageId,
    archiveSha256,
    reportSha256: sha256Bytes(canonicalReport),
    report,
  }
}

export function exactCycloneDxSbom({
  archiveSha256,
  imageId,
  rawBytes,
  repository,
  sourceCommit,
}) {
  if (!/^sha256:[0-9a-f]{64}$/.test(archiveSha256)) {
    throw new Error('archiveSha256 is invalid')
  }
  if (!/^sha256:[0-9a-f]{64}$/.test(imageId)) {
    throw new Error('imageId is invalid')
  }
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) {
    throw new Error('sourceCommit is invalid')
  }
  if (!/^ghcr\.io\/[a-z0-9_.-]+\/[a-z0-9_.\/-]+$/.test(repository)) {
    throw new Error('repository is invalid')
  }
  const sbom = parseJsonEvidence(rawBytes, 'CycloneDX SBOM')
  if (sbom.bomFormat !== 'CycloneDX' || !/^1\.[4-9]$/.test(String(sbom.specVersion))) {
    throw new Error('CycloneDX SBOM has an invalid schema')
  }
  const imageIdentityProperties = Array.isArray(sbom.metadata?.component?.properties)
    ? sbom.metadata.component.properties.filter(({ name }) => name === 'aquasecurity:trivy:ImageID')
    : []
  if (
    sbom.metadata?.component?.type !== 'container'
    || imageIdentityProperties.length !== 1
    || imageIdentityProperties[0].value !== imageId
  ) {
    throw new Error('CycloneDX SBOM image identity is invalid')
  }
  const properties = Array.isArray(sbom.metadata?.properties)
    ? sbom.metadata.properties.filter(({ name }) => !String(name).startsWith('org.kryv.teal.'))
    : []
  return {
    ...sbom,
    metadata: {
      ...(sbom.metadata ?? {}),
      properties: [
        ...properties,
        { name: 'org.kryv.teal.image-id', value: imageId },
        { name: 'org.kryv.teal.archive-sha256', value: archiveSha256 },
        { name: 'org.kryv.teal.source-commit', value: sourceCommit },
        { name: 'org.kryv.teal.repository', value: repository },
      ],
    },
  }
}

function commandArguments(args) {
  const command = args[0]
  if (!['create', 'verify'].includes(command)) {
    throw new Error('Usage: teal_release_candidate.mjs <create|verify> --root <path> --repository <owner/repository> --workflow <workflow> --ref <ref> --source-commit <commit> --source-run-id <id> --source-run-attempt <number> [--created-at <timestamp>]')
  }
  const values = new Map()
  for (let index = 1; index < args.length; index += 2) {
    const name = args[index]
    const value = args[index + 1]
    if (
      ![
        '--created-at',
        '--ref',
        '--repository',
        '--root',
        '--source-commit',
        '--source-run-attempt',
        '--source-run-id',
        '--workflow',
      ].includes(name)
      || !value
      || value.startsWith('-')
      || values.has(name)
    ) {
      throw new Error('Candidate command arguments are invalid')
    }
    values.set(name, value)
  }
  const required = [
    '--ref',
    '--repository',
    '--root',
    '--source-commit',
    '--source-run-attempt',
    '--source-run-id',
    '--workflow',
  ]
  if (required.some((name) => !values.has(name))) {
    throw new Error('Candidate command arguments are incomplete')
  }
  if (command === 'create' && !values.has('--created-at')) {
    throw new Error('Candidate creation time is required')
  }
  if (command === 'verify' && values.has('--created-at')) {
    throw new Error('Candidate verification must use the retained creation time')
  }
  if (values.size !== (command === 'create' ? 8 : 7)) {
    throw new Error('Candidate command arguments are invalid')
  }
  return {
    command,
    context: {
      repository: values.get('--repository'),
      workflow: values.get('--workflow'),
      ref: values.get('--ref'),
      sourceCommit: values.get('--source-commit'),
      sourceRunId: values.get('--source-run-id'),
      sourceRunAttempt: Number(values.get('--source-run-attempt')),
      createdAt: values.get('--created-at'),
    },
    root: values.get('--root'),
  }
}

async function readBoundedManifest(path) {
  let handle
  try {
    handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
    const metadata = await handle.stat()
    if (!metadata.isFile() || metadata.size < 1 || metadata.size > 1024 * 1024) {
      throw new Error('Candidate manifest must be a bounded regular file')
    }
    const chunks = []
    for await (const chunk of handle.createReadStream({ autoClose: false })) chunks.push(chunk)
    return Buffer.concat(chunks)
  } finally {
    await handle?.close()
  }
}

async function main(args) {
  const { command, context, root } = commandArguments(args)
  if (command === 'create') {
    const result = await createCandidateManifest({ context, root })
    process.stdout.write(`Created candidate manifest ${result.manifestSha256}\n`)
    return
  }
  const manifestBytes = await readBoundedManifest(join(resolve(root), 'candidate-manifest.json'))
  const result = await verifyCandidateDirectory({ expectedContext: context, manifestBytes, root })
  process.stdout.write(`Verified candidate manifest ${result.manifestSha256}\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`Candidate command failed: ${error.message}\n`)
    process.exitCode = 1
  }
}
