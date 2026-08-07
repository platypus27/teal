import { execFile } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'

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
  if (args.length !== 2 || args[0] !== '--image') {
    throw new Error('Usage: node scripts/verify-docs-image.mjs --image <local-image>')
  }
  const image = args[1]
  if (!image || image.startsWith('-') || /[\s\0]/.test(image)) {
    throw new Error('Image must be a non-empty, non-option Docker image reference')
  }
  return image
}

function composeArgs(projectName, generatedFile, ...args) {
  return ['compose', '--project-name', projectName, '--file', generatedFile, ...args]
}

function trivyRunArgs(archivePath, cacheDirectory, ...scanArgs) {
  return [
    'run',
    '--rm',
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
  const image = parseArguments(process.argv.slice(2))
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'teal-docs-integrity-'))
  const cacheDirectory = join(temporaryDirectory, 'trivy-cache')
  const archivePath = join(temporaryDirectory, 'image.tar')
  const generatedFile = join(temporaryDirectory, 'compose.json')
  const projectName = `teal-integrity-${process.pid}-${randomBytes(6).toString('hex')}`
  let generated = false
  let cacheCreated = false
  let localImageId
  let verificationError
  const cleanupErrors = []

  try {
    await mkdir(cacheDirectory)
    await chmod(cacheDirectory, 0o777)
    cacheCreated = true
    localImageId = await run('docker', ['image', 'inspect', image, '--format', '{{.Id}}'])
    if (!/^sha256:[0-9a-f]{64}$/.test(localImageId)) {
      throw new Error(`Docker returned an invalid local image ID: ${localImageId}`)
    }
    await run('docker', ['save', '--output', archivePath, image])
    await chmod(archivePath, 0o444)
    await run('docker', trivyRunArgs(
      archivePath,
      cacheDirectory,
      '--scanners',
      'vuln',
      '--severity',
      'HIGH,CRITICAL',
      '--ignore-unfixed',
      '--exit-code',
      '1',
    ), { timeout: 600_000 })
    await run('docker', trivyRunArgs(
      archivePath,
      cacheDirectory,
      '--scanners',
      'secret',
      '--exit-code',
      '1',
    ), { timeout: 600_000 })

    const configured = await run('docker', ['compose', '--file', composeFile, 'config', '--format', 'json'])
    const generatedConfig = JSON.parse(configured)
    delete generatedConfig.name
    for (const network of Object.values(generatedConfig.networks ?? {})) delete network.name
    for (const volume of Object.values(generatedConfig.volumes ?? {})) delete volume.name
    const docs = generatedConfig.services?.docs
    if (!docs) throw new Error('Resolved Compose configuration has no docs service')
    docs.image = image
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
  if (errors.length === 1) throw errors[0]
  if (errors.length > 1) throw new AggregateError(errors, 'Image verification and cleanup failed')
  console.log(`Verified docs image ${image} (${localImageId}) in ${projectName}`)
}

await main()
