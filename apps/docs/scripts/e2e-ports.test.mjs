// Ported from kryv-home's home/scripts/e2e-ports.test.mjs (same owner and
// design, ADR-0012). Teal's allocator has no multi-port or fixed-port
// helpers, so the tests for those are not carried over.
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'
import { candidateRanges, defaultRegistry, ownerAlive, ownerToken, refreshClaims, reservePort, runPort } from './e2e-ports.mjs'

const modulePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'e2e-ports.mjs')

function registry(t) {
  const directory = mkdtempSync(path.join(tmpdir(), 'kryv-e2e-ports-test-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  return directory
}

function listen(port) {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(port, '127.0.0.1', () => resolve(server))
  })
}

// A random source that replays the given fractions, then repeats the last.
function sequence(...values) {
  let index = 0
  return () => values[Math.min(index++, values.length - 1)]
}

const range = { low: 20_000, high: 32_000 }
const fraction = (port) => (port - range.low) / (range.high - range.low)

test('a reserved port sits below the ephemeral range and is bindable', async (t) => {
  const port = await reservePort({ registry: registry(t) })
  assert.ok(port >= range.low && port < range.high, `port ${port}`)
  const server = await listen(port)
  await new Promise((resolve) => server.close(resolve))
})

test('a port claimed by another reservation is never handed out twice', async (t) => {
  const directory = registry(t)
  const first = await reservePort({ registry: directory, random: sequence(0.5) })
  // The same candidate comes up first; the registry must refuse it.
  const second = await reservePort({ registry: directory, random: sequence(0.5, 0.25) })
  assert.notEqual(second, first)
  assert.equal(second, range.low + Math.floor(0.25 * (range.high - range.low)))
})

test('a port another process already listens on is skipped', async (t) => {
  const busy = await reservePort({ registry: registry(t) })
  const server = await listen(busy)
  t.after(() => new Promise((resolve) => server.close(resolve)))
  const port = await reservePort({ registry: registry(t), random: sequence(fraction(busy), 0.75) })
  assert.notEqual(port, busy)
})

test('a marker left by a dead process is reclaimed', async (t) => {
  const directory = registry(t)
  const dead = spawnSync(process.execPath, ['-e', 'console.log(process.pid)'], { encoding: 'utf8' })
  const candidate = range.low + Math.floor(0.4 * (range.high - range.low))
  const namespace = ownerToken().split(' ')[0]
  writeFileSync(path.join(directory, `${candidate}.lock`), `${namespace} ${dead.stdout.trim()}`)
  const port = await reservePort({ registry: directory, random: sequence(0.4) })
  assert.equal(port, candidate)
})

test('markers are released when the reserving process exits', (t) => {
  const directory = registry(t)
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
    const { reservePort } = await import(${JSON.stringify(pathToFileURL(modulePath).href)})
    for (let index = 0; index < 2; index += 1) await reservePort({ registry: ${JSON.stringify(directory)} })
    console.log(JSON.stringify((await import('node:fs')).readdirSync(${JSON.stringify(directory)}).length))
  `], { encoding: 'utf8' })
  assert.equal(child.status, 0, child.stderr)
  assert.equal(child.stdout.trim(), '2')
  assert.deepEqual(readdirSync(directory), [])
})

test('runPort publishes the reserved port and reuses it afterwards', async (t) => {
  const name = `KRYV_E2E_PORTS_TEST_${process.pid}`
  t.after(() => { delete process.env[name] })
  const port = await runPort(name, { registry: registry(t) })
  assert.equal(process.env[name], String(port))
  assert.equal(await runPort(name, { registry: registry(t) }), port)
})

test('runPort rejects a malformed explicit port', async (t) => {
  const name = `KRYV_E2E_PORTS_BAD_${process.pid}`
  process.env[name] = '0'
  t.after(() => { delete process.env[name] })
  await assert.rejects(runPort(name), /must be an integer from 1 through 65535/)
})

test('a claim marker always names its owner, so a crash can never leave an anonymous marker', async (t) => {
  const directory = registry(t)
  const port = await reservePort({ registry: directory })
  assert.equal(readFileSync(path.join(directory, `${port}.lock`), 'utf8'), ownerToken())
  // No temporary files are left beside the claim.
  assert.deepEqual(readdirSync(directory), [`${port}.lock`])
})

test('a stale marker that another process is already reclaiming is left to it', async (t) => {
  const directory = registry(t)
  const dead = spawnSync(process.execPath, ['-e', 'console.log(process.pid)'], { encoding: 'utf8' })
  const namespace = ownerToken().split(' ')[0]
  const stale = range.low + Math.floor(0.4 * (range.high - range.low))
  writeFileSync(path.join(directory, `${stale}.lock`), `${namespace} ${dead.stdout.trim()}`)
  // A concurrent reclaimer holds the port's reclaim lock.
  writeFileSync(path.join(directory, `${stale}.reclaim`), `${namespace} ${process.ppid}`)
  const port = await reservePort({ registry: directory, random: sequence(0.4, 0.6) })
  assert.notEqual(port, stale)
})

test('an owner in another pid namespace is presumed alive while it keeps its claim fresh', (t) => {
  const directory = registry(t)
  const marker = path.join(directory, 'claim')
  writeFileSync(marker, 'pid:[1] 999999999')
  assert.equal(ownerAlive('pid:[1] 999999999', marker), true)
  const old = Date.now() / 1000 - 6 * 60
  utimesSync(marker, old, old)
  assert.equal(ownerAlive('pid:[1] 999999999', marker), false)
  assert.equal(ownerAlive(ownerToken()), true)
  assert.equal(ownerAlive('garbage'), false)
})

test('KRYV_E2E_PORT_REGISTRY moves the registry', async (t) => {
  const directory = registry(t)
  process.env.KRYV_E2E_PORT_REGISTRY = directory
  t.after(() => { delete process.env.KRYV_E2E_PORT_REGISTRY })
  const port = await reservePort()
  assert.deepEqual(readdirSync(directory), [`${port}.lock`])
})

test('a live owner keeps refreshing its claims', async (t) => {
  const directory = registry(t)
  const port = await reservePort({ registry: directory })
  const marker = path.join(directory, `${port}.lock`)
  const old = Date.now() / 1000 - 6 * 60
  utimesSync(marker, old, old)
  refreshClaims()
  assert.ok(Date.now() - statSync(marker).mtimeMs < 60_000)
})

test('the default registry is a fixed per-user path that ignores TMPDIR', () => {
  const uid = process.getuid()
  assert.equal(defaultRegistry({ XDG_RUNTIME_DIR: '/run/user/77', TMPDIR: '/elsewhere' }), '/run/user/77/kryv-e2e-ports')
  assert.equal(defaultRegistry({ TMPDIR: '/elsewhere' }), `/tmp/kryv-e2e-ports-${uid}`)
  assert.equal(defaultRegistry({ KRYV_E2E_PORT_REGISTRY: '/x/y', XDG_RUNTIME_DIR: '/run/user/77' }), '/x/y')
})

test('the registry is created private and tightened when it is ours', async (t) => {
  const parent = registry(t)
  const directory = path.join(parent, 'reg')
  await reservePort({ registry: directory })
  assert.equal(statSync(directory).mode & 0o777, 0o700)
  const loose = path.join(parent, 'loose')
  mkdirSync(loose, { mode: 0o755 })
  chmodSync(loose, 0o755)
  await reservePort({ registry: loose })
  assert.equal(statSync(loose).mode & 0o777, 0o700)
})

test('a registry that is a symlink is refused', async (t) => {
  const parent = registry(t)
  const target = path.join(parent, 'target')
  mkdirSync(target, { mode: 0o700 })
  const link = path.join(parent, 'link')
  symlinkSync(target, link)
  await assert.rejects(reservePort({ registry: link }), /must be a real directory/)
})

test('the owner token names the process start time, so a reused pid is not mistaken for the owner', () => {
  const token = ownerToken()
  const [namespace, pid, start] = token.split(' ')
  assert.equal(Number(pid), process.pid)
  assert.match(start, /^\d+$/)
  assert.equal(ownerAlive(token), true)
  assert.equal(ownerAlive(`${namespace} ${pid} ${Number(start) + 1}`), false)
})

test('exit releases only the markers the process still owns', (t) => {
  const directory = registry(t)
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
    const { reservePort } = await import(${JSON.stringify(pathToFileURL(modulePath).href)})
    const fs = await import('node:fs')
    const ports = { mine: await reservePort({ registry: ${JSON.stringify(directory)} }), taken: await reservePort({ registry: ${JSON.stringify(directory)} }) }
    fs.writeFileSync(${JSON.stringify(directory)} + '/' + ports.taken + '.lock', 'pid:[1] 1 1')
    console.log(ports.taken)
  `], { encoding: 'utf8' })
  assert.equal(child.status, 0, child.stderr)
  assert.deepEqual(readdirSync(directory), [`${child.stdout.trim()}.lock`])
})

test('a fixture that exits on SIGTERM releases its claims', async (t) => {
  const directory = registry(t)
  const { spawn } = await import('node:child_process')
  const child = spawn(process.execPath, ['--input-type=module', '-e', `
    const { reservePort } = await import(${JSON.stringify(pathToFileURL(modulePath).href)})
    for (let index = 0; index < 2; index += 1) await reservePort({ registry: ${JSON.stringify(directory)} })
    for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => process.exit(0))
    console.log('ready')
    setInterval(() => {}, 1000)
  `], { stdio: ['ignore', 'pipe', 'inherit'] })
  await new Promise((resolve) => child.stdout.once('data', resolve))
  assert.equal(readdirSync(directory).length, 2)
  child.kill('SIGTERM')
  await new Promise((resolve) => child.once('exit', resolve))
  assert.deepEqual(readdirSync(directory), [])
})

test('candidates never fall in the kernel ephemeral range', async (t) => {
  assert.deepEqual(candidateRanges({ low: 20_000, high: 40_000 }, { low: 32_768, high: 60_999 }), [{ low: 20_000, high: 32_768 }])
  assert.deepEqual(candidateRanges({ low: 20_000, high: 32_000 }, { low: 10_000, high: 25_000 }), [{ low: 25_001, high: 32_000 }])
  assert.deepEqual(candidateRanges({ low: 20_000, high: 32_000 }, { low: 32_768, high: 60_999 }), [{ low: 20_000, high: 32_000 }])
  await assert.rejects(
    reservePort({ registry: registry(t), range: { low: 33_000, high: 34_000 }, ephemeralRange: { low: 32_768, high: 60_999 } }),
    /inside the kernel ephemeral range/,
  )
  for (let index = 0; index < 20; index += 1) {
    const port = await reservePort({ registry: registry(t), range: { low: 32_000, high: 40_000 }, ephemeralRange: { low: 32_768, high: 60_999 } })
    assert.ok(port >= 32_000 && port < 32_768, `port ${port}`)
  }
})

test('claim markers are private to their owner under a permissive umask', async (t) => {
  const directory = registry(t)
  const previous = process.umask(0o022)
  t.after(() => process.umask(previous))
  const port = await reservePort({ registry: directory })
  assert.equal(statSync(path.join(directory, `${port}.lock`)).mode & 0o777, 0o600)
})
