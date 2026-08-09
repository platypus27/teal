import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { posix } from 'node:path'

function normalizeDeclaredPath(path) {
  const target = path.startsWith('./') ? path.slice(2) : path
  if (
    target.length === 0 ||
    target.includes('\0') ||
    target.includes('\\') ||
    posix.isAbsolute(target) ||
    posix.normalize(target) !== target ||
    target.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new Error(`Declared package target escapes the package: ${path}`)
  }
  return target
}

function collectExportTargets(value, targets) {
  if (typeof value === 'string') {
    targets.add(normalizeDeclaredPath(value))
    return
  }
  if (!value || typeof value !== 'object') return
  for (const nested of Object.values(value)) collectExportTargets(nested, targets)
}

export function declaredPackageFiles(packageJson) {
  const files = new Set()
  for (const field of ['main', 'module', 'types']) {
    if (typeof packageJson[field] === 'string') files.add(normalizeDeclaredPath(packageJson[field]))
  }
  collectExportTargets(packageJson.exports, files)
  return [...files].sort()
}

export function assertSafeArchivePath(path, seen = new Set()) {
  if (
    typeof path !== 'string' ||
    path.length === 0 ||
    path.includes('\0') ||
    path.includes('\\') ||
    posix.isAbsolute(path)
  ) {
    throw new Error(`Unsafe archive path: ${String(path)}`)
  }

  const normalized = posix.normalize(path)
  const identity = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
  const segments = identity.split('/')
  if (
    normalized !== path ||
    (identity !== 'package' && !identity.startsWith('package/')) ||
    segments.some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new Error(`Unsafe archive path: ${path}`)
  }

  const normalizedIdentity = identity.normalize('NFC')
  if (seen.has(normalizedIdentity)) throw new Error(`Duplicate archive path: ${path}`)
  seen.add(normalizedIdentity)
  return normalized
}

export function assertPackedFiles({ packageJson, packedFiles, builtDistFiles = [] }) {
  const packed = new Set(packedFiles)
  const missing = declaredPackageFiles(packageJson).filter((file) => !packed.has(file))
  if (missing.length > 0) {
    throw new Error(`Missing declared package files: ${missing.join(', ')}`)
  }
  if (builtDistFiles.length === 0) {
    throw new Error('Package build produced no dist files')
  }
  const missingBuilt = builtDistFiles.filter((file) => !packed.has(file))
  if (missingBuilt.length > 0) {
    throw new Error(`Missing built dist files: ${missingBuilt.join(', ')}`)
  }
}

export function sha512Integrity(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha512')
    const stream = createReadStream(path)
    stream.on('error', reject)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(`sha512-${hash.digest('base64')}`))
  })
}
