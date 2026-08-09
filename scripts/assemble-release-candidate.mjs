import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import {
  lstat,
  mkdir,
  open,
  readFile,
  realpath,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import {
  createCandidateManifest,
  sha256Bytes,
} from './teal_release_candidate.mjs'
import { verifyDockerArchiveImageId } from './docker-archive.mjs'

const MAX_JSON_BYTES = 8 * 1024 * 1024
const MAX_INPUT_BYTES = 8 * 1024 * 1024 * 1024
const NPM_DESCRIPTOR_FIELDS = new Set([
  'integrity',
  'name',
  'sourceCommit',
  'tarballPath',
  'version',
])
const DOCS_DESCRIPTOR_FIELDS = new Set([
  'archive',
  'archiveSha256',
  'imageId',
  'repository',
  'sbom',
  'sbomSha256',
  'schemaVersion',
  'secretReceipt',
  'secretReceiptSha256',
  'sourceCommit',
  'vulnerabilityReceipt',
  'vulnerabilityReceiptSha256',
])

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

async function canonicalRegularFile(path, maximumBytes = MAX_INPUT_BYTES) {
  const absolute = resolve(path)
  const metadata = await lstat(absolute)
  if (
    !metadata.isFile()
    || metadata.isSymbolicLink()
    || metadata.size < 1
    || metadata.size > maximumBytes
    || await realpath(absolute) !== absolute
  ) {
    throw new Error(`Candidate input must be a bounded canonical regular file: ${path}`)
  }
  return { absolute, metadata }
}

async function readJson(path, label) {
  const { absolute } = await canonicalRegularFile(path, MAX_JSON_BYTES)
  let value
  try {
    value = JSON.parse(await readFile(absolute, 'utf8'))
  } catch {
    throw new Error(`${label} is invalid JSON`)
  }
  return value
}

async function copyStableFile(source, destination) {
  const { absolute } = await canonicalRegularFile(source)
  let input
  let output
  try {
    input = await open(absolute, constants.O_RDONLY | constants.O_NOFOLLOW)
    const before = await input.stat({ bigint: true })
    const sourceSize = Number(before.size)
    output = await open(
      destination,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o444,
    )
    const buffer = Buffer.allocUnsafe(1024 * 1024)
    let sourceOffset = 0
    let destinationOffset = 0
    while (sourceOffset < sourceSize) {
      const length = Math.min(buffer.length, sourceSize - sourceOffset)
      const { bytesRead } = await input.read(buffer, 0, length, sourceOffset)
      if (bytesRead < 1) throw new Error('Candidate input ended during copy')
      sourceOffset += bytesRead
      let written = 0
      while (written < bytesRead) {
        const result = await output.write(
          buffer,
          written,
          bytesRead - written,
          destinationOffset + written,
        )
        if (result.bytesWritten < 1) throw new Error('Candidate output write made no progress')
        written += result.bytesWritten
      }
      destinationOffset += bytesRead
    }
    await output.sync()
    const after = await input.stat({ bigint: true })
    if (
      before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
    ) {
      throw new Error('Candidate input changed during copy')
    }
  } finally {
    await output?.close()
    await input?.close()
  }
}

async function fileSha256(path) {
  const { absolute, metadata } = await canonicalRegularFile(path)
  const hash = createHash('sha256')
  const handle = await open(absolute, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    for await (const chunk of handle.createReadStream({ autoClose: false })) hash.update(chunk)
  } finally {
    await handle.close()
  }
  return {
    bytes: metadata.size,
    sha256: `sha256:${hash.digest('hex')}`,
  }
}

function exactDocsDescriptor(value, sourceCommit) {
  const fields = value?.configImageId === undefined
    ? DOCS_DESCRIPTOR_FIELDS
    : new Set([...DOCS_DESCRIPTOR_FIELDS, 'configImageId'])
  exactFields(value, fields, 'Docs descriptor')
  if (
    value.schemaVersion !== 2
    || value.sourceCommit !== sourceCommit
    || value.repository !== 'ghcr.io/platypus27/teal/teal-docs'
    || !/^sha256:[0-9a-f]{64}$/.test(value.imageId)
    || (
      value.configImageId !== undefined
      && (
        !/^sha256:[0-9a-f]{64}$/.test(value.configImageId)
        || value.configImageId === value.imageId
      )
    )
    || value.archive !== 'docs-image.tar'
    || value.sbom !== 'docs-image.sbom.cdx.json'
    || value.vulnerabilityReceipt !== 'docs-image.vulnerability.json'
    || value.secretReceipt !== 'docs-image.secret.json'
  ) {
    throw new Error('Docs descriptor identity is invalid')
  }
  for (const field of [
    'archiveSha256',
    'sbomSha256',
    'vulnerabilityReceiptSha256',
    'secretReceiptSha256',
  ]) {
    if (!/^sha256:[0-9a-f]{64}$/.test(value[field])) {
      throw new Error(`Docs descriptor ${field} is invalid`)
    }
  }
  return value
}

function verifyScanReceipt(receipt, descriptor, scanType) {
  const configImageId = descriptor.configImageId ?? descriptor.imageId
  if (
    receipt?.schemaVersion !== 1
    || receipt.status !== 'passed'
    || receipt.scanType !== scanType
    || receipt.scanner?.name !== 'trivy'
    || receipt.scanner.version !== '0.73.0'
    || receipt.sourceCommit !== descriptor.sourceCommit
    || receipt.repository !== descriptor.repository
    || receipt.imageId !== descriptor.imageId
    || receipt.configImageId !== descriptor.configImageId
    || receipt.archiveSha256 !== descriptor.archiveSha256
    || receipt.report?.SchemaVersion !== 2
    || receipt.report.ArtifactType !== 'container_image'
    || receipt.report.Metadata?.ImageID !== configImageId
    || !Array.isArray(receipt.report.Results)
  ) {
    throw new Error(`${scanType} receipt image or release identity mismatch`)
  }
  const reportBytes = Buffer.from(`${JSON.stringify(receipt.report, null, 2)}\n`)
  if (receipt.reportSha256 !== sha256Bytes(reportBytes)) {
    throw new Error(`${scanType} receipt report digest mismatch`)
  }
  const findings = receipt.report.Results.flatMap((result) => (
    scanType === 'vulnerability' ? result.Vulnerabilities ?? [] : result.Secrets ?? []
  ))
  if (findings.length > 0) throw new Error(`${scanType} receipt contains findings`)
}

function verifySbom(sbom, descriptor) {
  const configImageId = descriptor.configImageId ?? descriptor.imageId
  if (sbom?.bomFormat !== 'CycloneDX' || !/^1\.[4-9]$/.test(String(sbom.specVersion))) {
    throw new Error('Docs SBOM schema is invalid')
  }
  const properties = new Map((sbom.metadata?.properties ?? []).map(({ name, value }) => [name, value]))
  const rawImageIdentities = Array.isArray(sbom.metadata?.component?.properties)
    ? sbom.metadata.component.properties.filter(({ name }) => name === 'aquasecurity:trivy:ImageID')
    : []
  if (
    sbom.metadata?.component?.type !== 'container'
    || rawImageIdentities.length !== 1
    || rawImageIdentities[0].value !== configImageId
  ) {
    throw new Error('Docs SBOM raw image identity mismatch')
  }
  for (const [name, value] of [
    ['org.kryv.teal.image-id', descriptor.imageId],
    ['org.kryv.teal.config-image-id', descriptor.configImageId],
    ['org.kryv.teal.archive-sha256', descriptor.archiveSha256],
    ['org.kryv.teal.source-commit', descriptor.sourceCommit],
    ['org.kryv.teal.repository', descriptor.repository],
  ]) {
    if (properties.get(name) !== value) throw new Error(`Docs SBOM ${name} mismatch`)
  }
}

export async function validateDocsEvidenceDirectory(docsRoot, sourceCommit) {
  const descriptor = exactDocsDescriptor(
    await readJson(join(docsRoot, 'artifact.json'), 'Docs descriptor'),
    sourceCommit,
  )
  const evidence = [
    ['archive', 'archiveSha256'],
    ['sbom', 'sbomSha256'],
    ['vulnerabilityReceipt', 'vulnerabilityReceiptSha256'],
    ['secretReceipt', 'secretReceiptSha256'],
  ]
  for (const [pathField, digestField] of evidence) {
    const facts = await fileSha256(join(docsRoot, descriptor[pathField]))
    if (facts.sha256 !== descriptor[digestField]) {
      throw new Error(`Docs ${pathField} digest mismatch`)
    }
  }
  const archiveIdentity = await verifyDockerArchiveImageId(
    join(docsRoot, descriptor.archive),
    descriptor.imageId,
  )
  if (archiveIdentity.configImageId !== (descriptor.configImageId ?? descriptor.imageId)) {
    throw new Error('Docs archive config image identity mismatch')
  }
  const vulnerability = await readJson(
    join(docsRoot, descriptor.vulnerabilityReceipt),
    'Vulnerability receipt',
  )
  const secret = await readJson(join(docsRoot, descriptor.secretReceipt), 'Secret receipt')
  const sbom = await readJson(join(docsRoot, descriptor.sbom), 'Docs SBOM')
  verifyScanReceipt(vulnerability, descriptor, 'vulnerability')
  verifyScanReceipt(secret, descriptor, 'secret')
  verifySbom(sbom, descriptor)
  return descriptor
}

async function stageDocs(docsRoot, pending, sourceCommit) {
  const descriptor = await validateDocsEvidenceDirectory(docsRoot, sourceCommit)
  for (const name of [
    'artifact.json',
    descriptor.archive,
    descriptor.sbom,
    descriptor.vulnerabilityReceipt,
    descriptor.secretReceipt,
  ]) {
    await copyStableFile(join(docsRoot, name), join(pending, 'docs', name))
  }
}

async function stageNpm(npmRoot, pending, sourceCommit) {
  const descriptor = await readJson(join(npmRoot, 'artifact.json'), 'npm descriptor')
  exactFields(descriptor, NPM_DESCRIPTOR_FIELDS, 'npm descriptor')
  if (
    descriptor.name !== '@kryv/teal'
    || !/^0\.\d+\.\d+$/.test(descriptor.version)
    || descriptor.sourceCommit !== sourceCommit
    || !/^sha512-[A-Za-z0-9+/]{86}==$/.test(descriptor.integrity)
  ) {
    throw new Error('npm descriptor identity is invalid')
  }
  const canonicalRoot = await realpath(resolve(npmRoot))
  const tarballPath = await realpath(resolve(descriptor.tarballPath))
  const tarballRelative = relative(canonicalRoot, tarballPath)
  if (
    tarballRelative.startsWith('..')
    || tarballRelative.includes('/')
    || basename(tarballPath) !== `kryv-teal-${descriptor.version}.tgz`
  ) {
    throw new Error('npm descriptor tarball path escapes its artifact directory')
  }
  const tarballFacts = await fileSha256(tarballPath)
  await copyStableFile(tarballPath, join(pending, 'npm', basename(tarballPath)))
  await writeFile(join(pending, 'npm', 'artifact.json'), `${JSON.stringify({
    schemaVersion: 1,
    name: descriptor.name,
    version: descriptor.version,
    sourceCommit: descriptor.sourceCommit,
    integrity: descriptor.integrity,
    tarball: basename(tarballPath),
    tarballSha256: tarballFacts.sha256,
  }, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
}

export async function assembleReleaseCandidate({
  candidateRoot,
  controllerArchive,
  createdAt,
  deploymentModel,
  docsRoot,
  npmRoot,
  sourceBundle,
  sourceCommit,
  sourceRunAttempt,
  sourceRunId,
  workspaceRoot,
}) {
  const target = resolve(candidateRoot)
  const parent = dirname(target)
  await mkdir(parent, { recursive: true, mode: 0o700 })
  try {
    await lstat(target)
    throw new Error('Candidate output already exists')
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  const pending = join(parent, `.${basename(target)}.pending-${process.pid}`)
  try {
    await mkdir(pending, { mode: 0o700 })
    for (const directory of ['controller', 'docs', 'infra', 'npm', 'runtime', 'source']) {
      await mkdir(join(pending, directory), { mode: 0o700 })
    }
    await stageNpm(resolve(npmRoot), pending, sourceCommit)
    await stageDocs(resolve(docsRoot), pending, sourceCommit)
    await copyStableFile(
      controllerArchive,
      join(pending, 'controller/kryv-teal-production-controller.tar'),
    )
    await copyStableFile(deploymentModel, join(pending, 'deploy.docs.yml'))
    await copyStableFile(sourceBundle, join(pending, 'source/repository.bundle'))

    const runtime = new Map([
      ['scripts/owner-approval.mjs', 'runtime/owner-approval.mjs'],
      ['scripts/publish-candidate-package.mjs', 'runtime/publish-candidate-package.mjs'],
      ['scripts/reconcile-candidate-release.mjs', 'runtime/reconcile-candidate-release.mjs'],
      ['scripts/teal_release_candidate.mjs', 'runtime/teal_release_candidate.mjs'],
      ['scripts/teal_owner_authority.mjs', 'runtime/teal_owner_authority.mjs'],
      ['scripts/verify-owner-approval.mjs', 'runtime/verify-owner-approval.mjs'],
      ['infra/release-owner-approval.json', 'infra/release-owner-approval.json'],
    ])
    for (const [source, destination] of runtime) {
      await copyStableFile(join(resolve(workspaceRoot), source), join(pending, destination))
    }
    const result = await createCandidateManifest({
      context: {
        repository: 'platypus27/teal',
        workflow: 'platypus27/teal/.github/workflows/pipeline.yml',
        ref: 'refs/heads/master',
        sourceCommit,
        sourceRunId,
        sourceRunAttempt,
        createdAt,
      },
      root: pending,
    })
    await rename(pending, target)
    return result
  } catch (error) {
    await rm(pending, { recursive: true, force: true })
    throw error
  }
}

function commandArguments(args) {
  const names = new Set([
    '--candidate-root',
    '--controller-archive',
    '--created-at',
    '--deployment-model',
    '--docs-root',
    '--npm-root',
    '--source-bundle',
    '--source-commit',
    '--source-run-attempt',
    '--source-run-id',
    '--workspace-root',
  ])
  const values = new Map()
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index]
    const value = args[index + 1]
    if (!names.has(name) || !value || value.startsWith('-') || values.has(name)) {
      throw new Error('Candidate assembler arguments are invalid')
    }
    values.set(name, value)
  }
  if (values.size !== names.size) throw new Error('Candidate assembler arguments are incomplete')
  return {
    candidateRoot: values.get('--candidate-root'),
    controllerArchive: values.get('--controller-archive'),
    createdAt: values.get('--created-at'),
    deploymentModel: values.get('--deployment-model'),
    docsRoot: values.get('--docs-root'),
    npmRoot: values.get('--npm-root'),
    sourceBundle: values.get('--source-bundle'),
    sourceCommit: values.get('--source-commit'),
    sourceRunAttempt: Number(values.get('--source-run-attempt')),
    sourceRunId: values.get('--source-run-id'),
    workspaceRoot: values.get('--workspace-root'),
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await assembleReleaseCandidate(commandArguments(process.argv.slice(2)))
    process.stdout.write(`Assembled release candidate ${result.manifestSha256}\n`)
  } catch (error) {
    process.stderr.write(`Release candidate assembly failed: ${error.message}\n`)
    process.exitCode = 1
  }
}
