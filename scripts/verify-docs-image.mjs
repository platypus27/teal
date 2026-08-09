import { execFile } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { createReadStream } from 'node:fs'
import {
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, isAbsolute, join, posix, resolve } from 'node:path'
import { promisify } from 'node:util'

import { verifyDockerArchiveImageId } from './docker-archive.mjs'
import {
  exactCycloneDxSbom,
  exactScanReceipt,
  sha256Bytes,
} from './teal_release_candidate.mjs'

const exec = promisify(execFile)
const workspaceRoot = resolve(import.meta.dirname, '..')
const composeFile = join(workspaceRoot, 'docker-compose.yml')
const trivyImage = 'aquasec/trivy:0.73.0@sha256:7cced7cae583819fc7806d4cbc0dbbc7cad18b99f7d3e235192e6da8c091045c'

async function run(command, args, { timeout = 120_000 } = {}) {
  try {
    const result = await exec(command, args, {
      cwd: workspaceRoot,
      encoding: 'utf8',
      env: process.env,
      maxBuffer: 50 * 1024 * 1024,
      timeout,
    })
    if (result.stdout) process.stdout.write(result.stdout)
    if (result.stderr) process.stderr.write(result.stderr)
    return result.stdout.trim()
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout)
    if (error.stderr) process.stderr.write(error.stderr)
    throw error
  }
}

function parseArguments(args) {
  const values = new Map()
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index]
    const value = args[index + 1]
    if (
      ![
        '--image',
        '--revision',
        '--source',
        '--descriptor',
        '--repository',
        '--temporary-root',
      ].includes(name)
      || !value
      || value.startsWith('-')
      || values.has(name)
    ) {
      throw new Error('Usage: node scripts/verify-docs-image.mjs --image <local-image> --revision <commit> --source <repository-url> [--temporary-root <absolute-directory>] [--descriptor .release/<file>.json --repository ghcr.io/<owner>/<image>]')
    }
    values.set(name, value)
  }
  if (
    !values.has('--image')
    || !values.has('--revision')
    || !values.has('--source')
    || values.has('--descriptor') !== values.has('--repository')
  ) {
    throw new Error('Documentation image verification arguments are incomplete')
  }
  const image = values.get('--image')
  if (!image || image.startsWith('-') || /[\s\0]/.test(image)) {
    throw new Error('Image must be a non-empty, non-option Docker image reference')
  }
  const revision = values.get('--revision')
  if (!/^[0-9a-f]{40}$/.test(revision)) {
    throw new Error('Revision must be a full lowercase 40-character Git commit')
  }
  const source = values.get('--source')
  let sourceUrl
  try {
    sourceUrl = new URL(source)
  } catch {
    throw new Error('Source must be a canonical HTTPS repository URL')
  }
  if (
    sourceUrl.protocol !== 'https:' || sourceUrl.username || sourceUrl.password ||
    sourceUrl.search || sourceUrl.hash || sourceUrl.pathname === '/' ||
    sourceUrl.toString() !== source
  ) {
    throw new Error('Source must be a canonical HTTPS repository URL')
  }
  const descriptor = values.get('--descriptor')
  if (
    descriptor
    && (
      isAbsolute(descriptor)
      || !descriptor.startsWith('.release/')
      || !descriptor.endsWith('.json')
      || posix.normalize(descriptor) !== descriptor
      || descriptor.split('/').some((segment) => !segment || segment === '.' || segment === '..')
    )
  ) {
    throw new Error('Descriptor must be a confined .release JSON path')
  }
  const repository = values.get('--repository')
  if (
    repository
    && !/^ghcr\.io\/[a-z0-9_.-]+\/[a-z0-9_.\/-]+$/.test(repository)
  ) {
    throw new Error('Repository must be a canonical lowercase GHCR repository')
  }
  const temporaryRoot = values.get('--temporary-root')
  if (temporaryRoot && !isAbsolute(temporaryRoot)) {
    throw new Error('Temporary root must be an absolute existing directory')
  }
  return { descriptor, image, repository, revision, source, temporaryRoot }
}

async function resolveTemporaryRoot(requestedRoot) {
  if (!requestedRoot) return tmpdir()
  try {
    const resolvedRoot = await realpath(requestedRoot)
    const rootStat = await stat(resolvedRoot)
    if (resolvedRoot !== requestedRoot || !rootStat.isDirectory()) throw new Error()
    return resolvedRoot
  } catch {
    throw new Error('Temporary root must be an absolute existing canonical directory')
  }
}

function sha256File(path) {
  return new Promise((resolveDigest, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(path)
    stream.on('error', reject)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolveDigest(`sha256:${hash.digest('hex')}`))
  })
}

function composeArgs(projectName, generatedFile, ...args) {
  return ['compose', '--project-name', projectName, '--file', generatedFile, ...args]
}

function trivyRunArgs(archivePath, cacheDirectory, evidenceDirectory, ...scanArgs) {
  return [
    'run',
    '--rm',
    '--user',
    `${process.getuid()}:${process.getgid()}`,
    '--read-only',
    '--cap-drop',
    'ALL',
    '--security-opt',
    'no-new-privileges:true',
    '--tmpfs',
    '/tmp:rw,noexec,nosuid,nodev,size=512m',
    '--mount',
    `type=bind,src=${archivePath},dst=/scan/image.tar,readonly`,
    '--mount',
    `type=bind,src=${cacheDirectory},dst=/cache`,
    '--mount',
    `type=bind,src=${evidenceDirectory},dst=/evidence`,
    trivyImage,
    'image',
    '--cache-dir',
    '/cache',
    '--input',
    '/scan/image.tar',
    '--no-progress',
    ...scanArgs,
  ]
}

function trivyCleanArgs(cacheDirectory) {
  return [
    'run',
    '--rm',
    '--user',
    `${process.getuid()}:${process.getgid()}`,
    '--read-only',
    '--cap-drop',
    'ALL',
    '--security-opt',
    'no-new-privileges:true',
    '--tmpfs',
    '/tmp:rw,noexec,nosuid,nodev,size=64m',
    '--mount',
    `type=bind,src=${cacheDirectory},dst=/cache`,
    trivyImage,
    'clean',
    '--cache-dir',
    '/cache',
    '--all',
  ]
}

async function requireResponse(url, requiredHeaders = []) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(3_000) })
  if (response.status !== 200) throw new Error(`${url} returned HTTP ${response.status}`)
  for (const header of requiredHeaders) {
    if (!response.headers.get(header)) throw new Error(`${url} is missing ${header}`)
  }
  return response
}

async function waitForRuntime(origin) {
  const deadline = Date.now() + 60_000
  let lastError
  while (Date.now() < deadline) {
    try {
      await requireResponse(`${origin}/healthz`)
      await requireResponse(`${origin}/`, [
        'content-security-policy',
        'referrer-policy',
        'permissions-policy',
      ])
      return
    } catch (error) {
      lastError = error
      await new Promise((resolveWait) => setTimeout(resolveWait, 1_000))
    }
  }
  throw new Error(`Documentation image did not become healthy: ${lastError?.message ?? 'timeout'}`)
}

async function main() {
  const { descriptor, image, repository, revision, source, temporaryRoot } = parseArguments(process.argv.slice(2))
  const resolvedTemporaryRoot = await resolveTemporaryRoot(temporaryRoot)
  const temporaryDirectory = await mkdtemp(join(resolvedTemporaryRoot, 'teal-docs-integrity-'))
  const cacheDirectory = join(temporaryDirectory, 'trivy-cache')
  const evidenceDirectory = join(temporaryDirectory, 'trivy-evidence')
  const archivePath = join(temporaryDirectory, 'image.tar')
  const vulnerabilityRawPath = join(evidenceDirectory, 'vulnerability.raw.json')
  const secretRawPath = join(evidenceDirectory, 'secret.raw.json')
  const sbomRawPath = join(evidenceDirectory, 'sbom.raw.cdx.json')
  const generatedFile = join(temporaryDirectory, 'compose.json')
  const projectName = `teal-integrity-${process.pid}-${randomBytes(6).toString('hex')}`
  let generated = false
  let cacheCreated = false
  let localImageId
  let archiveSha256
  let pendingArtifactDirectory
  let artifactDirectory
  let verificationError
  const cleanupErrors = []

  try {
    await mkdir(cacheDirectory, { mode: 0o700 })
    await mkdir(evidenceDirectory, { mode: 0o700 })
    await chmod(cacheDirectory, 0o700)
    await chmod(evidenceDirectory, 0o700)
    cacheCreated = true
    localImageId = await run('docker', ['image', 'inspect', image, '--format', '{{.Id}}'])
    if (!/^sha256:[0-9a-f]{64}$/.test(localImageId)) {
      throw new Error(`Docker returned an invalid local image ID: ${localImageId}`)
    }
    const imageRevision = await run('docker', [
      'image', 'inspect', localImageId, '--format',
      '{{index .Config.Labels "org.opencontainers.image.revision"}}',
    ])
    if (imageRevision !== revision) {
      throw new Error(`Documentation image revision mismatch: expected ${revision}, received ${imageRevision || 'missing label'}`)
    }
    const imageSource = await run('docker', [
      'image', 'inspect', localImageId, '--format',
      '{{index .Config.Labels "org.opencontainers.image.source"}}',
    ])
    if (imageSource !== source) {
      throw new Error(`Documentation image source mismatch: expected ${source}, received ${imageSource || 'missing label'}`)
    }
    await run('docker', ['save', '--output', archivePath, localImageId])
    await chmod(archivePath, 0o444)
    await verifyDockerArchiveImageId(archivePath, localImageId)
    archiveSha256 = await sha256File(archivePath)
    await run('docker', trivyRunArgs(
      archivePath,
      cacheDirectory,
      evidenceDirectory,
      '--scanners',
      'vuln',
      '--severity',
      'HIGH,CRITICAL',
      '--format',
      'json',
      '--output',
      '/evidence/vulnerability.raw.json',
      '--exit-code',
      '1',
    ), { timeout: 600_000 })
    await run('docker', trivyRunArgs(
      archivePath,
      cacheDirectory,
      evidenceDirectory,
      '--scanners',
      'secret',
      '--format',
      'json',
      '--output',
      '/evidence/secret.raw.json',
      '--exit-code',
      '1',
    ), { timeout: 600_000 })
    await run('docker', trivyRunArgs(
      archivePath,
      cacheDirectory,
      evidenceDirectory,
      '--format',
      'cyclonedx',
      '--output',
      '/evidence/sbom.raw.cdx.json',
    ), { timeout: 600_000 })

    const configured = await run('docker', ['compose', '--file', composeFile, 'config', '--format', 'json'])
    const generatedConfig = JSON.parse(configured)
    delete generatedConfig.name
    for (const network of Object.values(generatedConfig.networks ?? {})) delete network.name
    for (const volume of Object.values(generatedConfig.volumes ?? {})) delete volume.name
    const docs = generatedConfig.services?.docs
    if (!docs) throw new Error('Resolved Compose configuration has no docs service')
    docs.image = localImageId
    delete docs.build
    const configuredPort = process.env.TEAL_DOCS_VERIFY_PORT
    if (configuredPort && (!/^\d+$/.test(configuredPort) || Number(configuredPort) < 1024 || Number(configuredPort) > 65535)) {
      throw new Error('TEAL_DOCS_VERIFY_PORT must be an unprivileged TCP port')
    }
    docs.ports = [{
      host_ip: '127.0.0.1',
      protocol: 'tcp',
      published: configuredPort ?? '0',
      target: 8080,
    }]
    await writeFile(generatedFile, `${JSON.stringify(generatedConfig, null, 2)}\n`, { flag: 'wx' })
    generated = true

    await run('docker', composeArgs(projectName, generatedFile, 'up', '-d', '--no-build', 'docs'))
    const portOutput = await run('docker', composeArgs(projectName, generatedFile, 'port', 'docs', '8080'))
    const portMatch = portOutput.match(/^127\.0\.0\.1:(\d+)$/m)
    if (!portMatch) throw new Error(`Could not resolve isolated docs port: ${portOutput}`)
    await waitForRuntime(`http://127.0.0.1:${portMatch[1]}`)

    const containerId = await run('docker', composeArgs(projectName, generatedFile, 'ps', '-q', 'docs'))
    if (!/^[0-9a-f]{12,64}$/.test(containerId)) throw new Error('Compose did not return the isolated docs container ID')
    const runningImageId = await run('docker', ['inspect', '--format', '{{.Image}}', containerId])
    if (runningImageId !== localImageId) {
      throw new Error(`Running container .Image mismatch: expected ${localImageId}, received ${runningImageId}`)
    }

    if (descriptor) {
      const descriptorPath = resolve(workspaceRoot, descriptor)
      artifactDirectory = dirname(descriptorPath)
      await mkdir(dirname(artifactDirectory), { recursive: true, mode: 0o700 })
      pendingArtifactDirectory = join(
        dirname(artifactDirectory),
        `.${basename(artifactDirectory)}.pending-${process.pid}-${randomBytes(8).toString('hex')}`,
      )
      await mkdir(pendingArtifactDirectory, { mode: 0o700 })

      const [vulnerabilityRaw, secretRaw, sbomRaw] = await Promise.all([
        readFile(vulnerabilityRawPath),
        readFile(secretRawPath),
        readFile(sbomRawPath),
      ])
      const vulnerability = exactScanReceipt({
        archiveSha256,
        imageId: localImageId,
        rawBytes: vulnerabilityRaw,
        repository,
        scanType: 'vulnerability',
        sourceCommit: revision,
      })
      const secret = exactScanReceipt({
        archiveSha256,
        imageId: localImageId,
        rawBytes: secretRaw,
        repository,
        scanType: 'secret',
        sourceCommit: revision,
      })
      const sbom = exactCycloneDxSbom({
        archiveSha256,
        imageId: localImageId,
        rawBytes: sbomRaw,
        repository,
        sourceCommit: revision,
      })
      const vulnerabilityBytes = Buffer.from(`${JSON.stringify(vulnerability, null, 2)}\n`)
      const secretBytes = Buffer.from(`${JSON.stringify(secret, null, 2)}\n`)
      const sbomBytes = Buffer.from(`${JSON.stringify(sbom, null, 2)}\n`)
      const descriptorBytes = Buffer.from(`${JSON.stringify({
        schemaVersion: 2,
        sourceCommit: revision,
        repository,
        imageId: localImageId,
        archive: 'docs-image.tar',
        archiveSha256,
        sbom: 'docs-image.sbom.cdx.json',
        sbomSha256: sha256Bytes(sbomBytes),
        vulnerabilityReceipt: 'docs-image.vulnerability.json',
        vulnerabilityReceiptSha256: sha256Bytes(vulnerabilityBytes),
        secretReceipt: 'docs-image.secret.json',
        secretReceiptSha256: sha256Bytes(secretBytes),
      }, null, 2)}\n`)

      await Promise.all([
        copyFile(archivePath, join(pendingArtifactDirectory, 'docs-image.tar')),
        writeFile(
          join(pendingArtifactDirectory, 'docs-image.sbom.cdx.json'),
          sbomBytes,
          { flag: 'wx', mode: 0o444 },
        ),
        writeFile(
          join(pendingArtifactDirectory, 'docs-image.vulnerability.json'),
          vulnerabilityBytes,
          { flag: 'wx', mode: 0o444 },
        ),
        writeFile(
          join(pendingArtifactDirectory, 'docs-image.secret.json'),
          secretBytes,
          { flag: 'wx', mode: 0o444 },
        ),
        writeFile(
          join(pendingArtifactDirectory, basename(descriptorPath)),
          descriptorBytes,
          { flag: 'wx', mode: 0o444 },
        ),
      ])
      await chmod(join(pendingArtifactDirectory, 'docs-image.tar'), 0o444)
    }
  } catch (error) {
    verificationError = error
  } finally {
    if (generated) {
      try {
        await run('docker', composeArgs(projectName, generatedFile, 'down', '--remove-orphans'))
      } catch (error) {
        process.stderr.write(`Failed to clean isolated Compose project ${projectName}: ${error.message}\n`)
        cleanupErrors.push(error)
      }
    }
    if (cacheCreated) {
      try {
        await run('docker', trivyCleanArgs(cacheDirectory))
      } catch (error) {
        process.stderr.write(`Failed to clean isolated Trivy cache: ${error.message}\n`)
        cleanupErrors.push(error)
      }
    }
    try {
      await rm(temporaryDirectory, { recursive: true, force: true })
    } catch (error) {
      process.stderr.write(`Failed to remove isolated verifier directory ${temporaryDirectory}: ${error.message}\n`)
      cleanupErrors.push(error)
    }
  }

  const errors = [verificationError, ...cleanupErrors].filter(Boolean)
  if (errors.length > 0) {
    if (pendingArtifactDirectory) {
      await rm(pendingArtifactDirectory, { recursive: true, force: true })
    }
    if (errors.length === 1) throw errors[0]
    throw new AggregateError(errors, 'Image verification and cleanup failed')
  }
  if (pendingArtifactDirectory) {
    await rename(pendingArtifactDirectory, artifactDirectory)
  }
  console.log(`Verified docs image ${image} (${localImageId}) in ${projectName}`)
}

await main()
