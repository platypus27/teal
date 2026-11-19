// Free loopback ports for the Teal docs Playwright runs and dev servers.
//
// The docs suite used to pin 5173, so two runs on one shared host collided
// and had to be serialized by hand. Each run now reserves its ports here and
// passes them to its servers and specs through the environment, following
// the same design as kryv-home's scripts/e2e-ports.mjs (home/docs/adr
// ADR-0043-per-run-browser-suite-ports.md); the registry directory is shared
// with Home on purpose, so a Teal run and a Home run never claim each
// other's ports.
//
// The allocator follows Google's portpicker: candidates come from a range
// kept clear of the kernel's ephemeral range (read from
// /proc/sys/net/ipv4/ip_local_port_range; outbound connections are assigned
// ports from it, so a port that is checked free and bound a moment later
// cannot be taken by a stray connect()), and each candidate is proven free
// by binding it on the loopback addresses the suites use. Because a reserved
// port is released before its server binds it (often after a web build),
// concurrent runs also claim each port in a machine-wide registry: a marker
// file, created atomically with its owner already written in it, that names
// the owning process by pid namespace, pid, and start time (so a reused pid
// is never mistaken for the owner). A marker whose owner is gone is stale
// and reclaimed under a per-port reclaim lock, so a killed run never leaks
// ports and two reclaimers can never both win. A process removes the markers
// it still owns when it exits normally (process.exit included, which is how
// Playwright stops a webServer with SIGTERM); a process killed outright
// leaves them for the next reservation to reclaim.
//
// The registry is one fixed directory per user, independent of TMPDIR, so
// every run of that user sees the same claims: $XDG_RUNTIME_DIR/kryv-e2e-ports
// or /tmp/kryv-e2e-ports-<uid>. It must be a real directory (not a symlink)
// owned by the user, and is kept at mode 0700.

import { randomBytes } from 'node:crypto'
import { chmodSync, linkSync, lstatSync, mkdirSync, readFileSync, readlinkSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { join } from 'node:path'

export const DEFAULT_PORT_RANGE = Object.freeze({ low: 20_000, high: 32_000 })
const LOOPBACK_HOSTS = ['127.0.0.1', '::1']
// A claim from another pid namespace cannot be checked for liveness. Owners
// refresh their claims every REFRESH_MS, so such a claim is honored until it
// has gone unrefreshed for FOREIGN_CLAIM_TTL_MS.
const REFRESH_MS = 60 * 1000
const FOREIGN_CLAIM_TTL_MS = 5 * 60 * 1000
const held = new Set()
let refreshTimer = null

/** The registry directory for this user: an explicit override, else a fixed per-user path. */
export function defaultRegistry(env = process.env) {
  if (env.KRYV_E2E_PORT_REGISTRY) return env.KRYV_E2E_PORT_REGISTRY
  if (env.XDG_RUNTIME_DIR) return join(env.XDG_RUNTIME_DIR, 'kryv-e2e-ports')
  return `/tmp/kryv-e2e-ports-${process.getuid?.() ?? 'user'}`
}

// Create the registry private, and refuse one that another user (or a
// symlink planted in a shared directory) could control.
function openRegistry(registry) {
  mkdirSync(registry, { recursive: true, mode: 0o700 })
  const stats = lstatSync(registry)
  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    throw new Error(`port registry ${registry} must be a real directory, not a symlink`)
  }
  const uid = process.getuid?.()
  if (uid !== undefined && stats.uid !== uid) {
    throw new Error(`port registry ${registry} is owned by uid ${stats.uid}, not ${uid}`)
  }
  if ((stats.mode & 0o077) !== 0) chmodSync(registry, 0o700)
}

/** The kernel's ephemeral port range, or null where it cannot be read. */
function kernelEphemeralRange() {
  try {
    const [low, high] = readFileSync('/proc/sys/net/ipv4/ip_local_port_range', 'utf8').trim().split(/\s+/).map(Number)
    return Number.isInteger(low) && Number.isInteger(high) ? { low, high } : null
  } catch {
    return null
  }
}

/**
 * The parts of `range` (low inclusive, high exclusive) outside the
 * ephemeral range (both ends inclusive, as the kernel states it).
 */
export function candidateRanges(range, ephemeral) {
  if (!ephemeral) return [{ ...range }]
  const parts = [
    { low: range.low, high: Math.min(range.high, ephemeral.low) },
    { low: Math.max(range.low, ephemeral.high + 1), high: range.high },
  ]
  return parts.filter((part) => part.high > part.low)
}

function pidNamespace() {
  try {
    return readlinkSync('/proc/self/ns/pid')
  } catch {
    return 'host'
  }
}

// A process's start time in clock ticks since boot (field 22 of
// /proc/<pid>/stat), or null where /proc is unavailable.
function processStartTime(pid) {
  try {
    const stat = readFileSync(`/proc/${pid}/stat`, 'utf8')
    return stat.slice(stat.lastIndexOf(')') + 2).split(' ')[19] ?? null
  } catch {
    return null
  }
}

/** This process as a registry owner: its pid namespace, pid, and start time. */
export function ownerToken() {
  return `${pidNamespace()} ${process.pid} ${processStartTime(process.pid) ?? 0}`
}

/**
 * Whether the owner named by a token may still be running. A pid is only
 * meaningful in its own namespace: an owner from another namespace is
 * presumed alive while it keeps its claim (the file at `claimPath`) fresh.
 */
export function ownerAlive(token, claimPath) {
  const match = /^(\S+) (\d+)(?: (\d+))?$/.exec(String(token ?? '').trim())
  if (!match) return false
  const [, namespace, pidText, startText] = match
  if (namespace !== pidNamespace()) {
    if (!claimPath) return true
    try {
      return Date.now() - statSync(claimPath).mtimeMs < FOREIGN_CLAIM_TTL_MS
    } catch {
      return false
    }
  }
  try {
    process.kill(Number(pidText), 0)
  } catch (error) {
    if (error.code !== 'EPERM') return false
  }
  // A live pid is the owner only if it is the same process: a pid reused by
  // a later process has another start time. A token without a start time
  // (or a host without /proc) can only be judged by the pid.
  if (startText === undefined || startText === '0') return true
  const start = processStartTime(pidText)
  return start === null || start === startText
}

function canBind(port, host) {
  return new Promise((resolve) => {
    const server = createServer()
    server.unref()
    server.once('error', (error) => {
      // A host without IPv6 cannot conflict on ::1.
      resolve(error.code === 'EADDRNOTAVAIL' || error.code === 'EAFNOSUPPORT')
    })
    server.listen({ port, host, exclusive: true }, () => {
      server.close(() => resolve(true))
    })
  })
}

async function isFree(port) {
  for (const host of LOOPBACK_HOSTS) {
    if (!(await canBind(port, host))) return false
  }
  return true
}

// Remove a marker only while it still names this process: one that was
// reclaimed from under us (for example after a suspend outlived the foreign
// claim expiry) belongs to its new owner.
function removeOwned(marker) {
  try {
    if (readFileSync(marker, 'utf8') === ownerToken()) rmSync(marker, { force: true })
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

function releaseHeld() {
  for (const marker of held) removeOwned(marker)
  held.clear()
}

/** Mark this process's claims as still owned (run on a timer while it lives). */
export function refreshClaims() {
  const now = new Date()
  for (const marker of held) {
    try {
      utimesSync(marker, now, now)
    } catch {
      // A claim removed from under us is simply gone.
    }
  }
}

// Create `path` holding this process's token, or fail with EEXIST. The token
// is written to a private file first and hard-linked into place, so the
// marker never exists without its owner in it.
function createOwned(path) {
  const draft = `${path}.${process.pid}.${randomBytes(4).toString('hex')}.draft`
  writeFileSync(draft, ownerToken())
  try {
    linkSync(draft, path)
  } finally {
    rmSync(draft, { force: true })
  }
}

function readOwner(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function hold(marker) {
  held.add(marker)
  if (refreshTimer === null) {
    process.once('exit', releaseHeld)
    refreshTimer = setInterval(refreshClaims, REFRESH_MS)
    refreshTimer.unref()
  }
}

function release(marker) {
  removeOwned(marker)
  held.delete(marker)
}

// Take over a stale marker. Only the holder of the port's reclaim lock may
// replace it, and only after re-reading that it still names the owner found
// stale, so a fresh claim made in the meantime is never deleted. The lock is
// held for a few file operations; a process killed inside them leaves it
// behind and that one port is then never reclaimed. Removing it automatically
// would reopen the race the lock closes, so allocation simply picks another
// port.
function reclaim(registry, port, marker, staleOwner) {
  const lock = join(registry, `${port}.reclaim`)
  try {
    createOwned(lock)
  } catch (error) {
    if (error.code === 'EEXIST') return false
    throw error
  }
  try {
    if (readOwner(marker) !== staleOwner) return false
    rmSync(marker, { force: true })
    createOwned(marker)
    return true
  } catch (error) {
    if (error.code === 'EEXIST') return false
    throw error
  } finally {
    rmSync(lock, { force: true })
  }
}

function claim(registry, port) {
  const marker = join(registry, `${port}.lock`)
  try {
    createOwned(marker)
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    const owner = readOwner(marker)
    if (owner === null || ownerAlive(owner, marker)) return false
    if (!reclaim(registry, port, marker, owner)) return false
  }
  hold(marker)
  return true
}

/**
 * Reserve one free loopback port for this process.
 * @param {{ range?: { low: number, high: number }, ephemeralRange?: { low: number, high: number } | null, registry?: string, attempts?: number, random?: () => number }} [options]
 * @returns {Promise<number>}
 */
export async function reservePort({
  range = DEFAULT_PORT_RANGE,
  ephemeralRange = kernelEphemeralRange(),
  registry = defaultRegistry(),
  attempts = 500,
  random = Math.random,
} = {}) {
  const parts = candidateRanges(range, ephemeralRange)
  if (parts.length === 0) {
    throw new Error(`port range ${range.low}-${range.high} lies inside the kernel ephemeral range ${ephemeralRange.low}-${ephemeralRange.high}`)
  }
  const size = parts.reduce((total, part) => total + part.high - part.low, 0)
  openRegistry(registry)
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    let offset = Math.floor(random() * size)
    const part = parts.find((candidate) => {
      if (offset < candidate.high - candidate.low) return true
      offset -= candidate.high - candidate.low
      return false
    })
    const port = part.low + offset
    if (!claim(registry, port)) continue
    if (await isFree(port)) return port
    // Something outside the registry owns it; give the claim back.
    release(join(registry, `${port}.lock`))
  }
  throw new Error(`no free loopback port in ${range.low}-${range.high} after ${attempts} attempts`)
}

/**
 * The run's port for `name`: reserved once in the Playwright runner and read
 * back from the environment everywhere else. Playwright re-evaluates the
 * config in every worker process, and workers inherit the runner's
 * environment, so the first evaluation publishes the port and every later one
 * (and the webServer command) sees the same value. An explicit value from
 * the caller wins, and is validated but not claimed.
 * @param {string} name
 * @param {Parameters<typeof reservePort>[0]} [options]
 * @returns {Promise<number>}
 */
export async function runPort(name, options) {
  const existing = process.env[name]
  if (existing !== undefined && existing !== '') {
    const port = Number(existing)
    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
      throw new Error(`${name} must be an integer from 1 through 65535, got ${JSON.stringify(existing)}`)
    }
    return port
  }
  const port = await reservePort(options)
  process.env[name] = String(port)
  return port
}
