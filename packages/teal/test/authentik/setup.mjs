// Configures the disposable Authentik fixture: applies the generated Teal
// adapter as the default brand's custom CSS and installs the fixture flow
// background. Idempotent; safe to re-run.
import { readFile, writeFile } from 'node:fs/promises'
import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'
import { deflateSync } from 'node:zlib'
import { resolve } from 'node:path'

const execFile = promisify(execFileCallback)
const base = 'http://127.0.0.1:19000'
const token = 'authentik-fixture-token'
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
const cssPath = resolve(import.meta.dirname, '../../src/authentik.css')
const composeFile = resolve(import.meta.dirname, 'docker-compose.yml')

// 16x16 solid PNG in the Teal dark background color, written into the server
// container and referenced as the brand flow background. The chrome text on
// flow pages is light by design, so the background asset must stay dark.
await main()

async function main() {
  await waitReady()
  const css = await readFile(cssPath, 'utf8')

  const brands = await fetch(`${base}/api/v3/core/brands/`, { headers }).then((r) => r.json())
  const brand = brands.results.find((entry) => entry.default) ?? brands.results[0]
  if (!brand) throw new Error('No brand found in fixture')

  const cssField = ['branding_custom_css', 'custom_css', 'custom_css_flow'].find((key) => key in brand)
  if (!cssField) {
    throw new Error(`No custom CSS field on brand; available fields: ${Object.keys(brand).sort().join(', ')}`)
  }

  const backgroundPath = '/tmp/teal-flow-background.png'
  await writeFile(backgroundPath, makeSolidPng(3, 22, 23))
  await execFile('docker', ['compose', '-f', composeFile, 'cp', backgroundPath, 'server:/web/dist/assets/images/teal_flow_background.png'])

  const updated = await fetch(`${base}/api/v3/core/brands/${brand.brand_uuid}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      [cssField]: css,
      branding_title: 'Kryv',
      branding_default_flow_background: '/static/dist/assets/images/teal_flow_background.png',
    }),
  })
  if (!updated.ok) throw new Error(`Brand update failed: ${updated.status} ${await updated.text()}`)
  console.log(`Applied Teal adapter to brand "${brand.brand_uuid}" via ${cssField} (${css.length} bytes)`)
}

function makeSolidPng(red, green, blue) {
  const width = 16
  const height = 16
  const pixel = Buffer.from([red, green, blue])
  const raw = Buffer.concat(Array.from({ length: height }, () => Buffer.concat([Buffer.from([0]), Buffer.concat(Array.from({ length: width }, () => pixel))])))
  function chunk(type, data) {
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(body) >>> 0)
    return Buffer.concat([length, body, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return crc ^ 0xffffffff
}

async function waitReady() {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      const response = await fetch(`${base}/-/health/ready/`)
      if (response.ok) return
    } catch {
      // not up yet
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 5000))
  }
  throw new Error('Authentik fixture did not become ready')
}

