import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { create as createTar } from 'tar'

import { verifyDockerArchiveImageId } from '../scripts/docker-archive.mjs'

async function archiveFixture(t, {
  config = '{"architecture":"amd64"}\n',
  configPath,
  manifestConfigPath,
} = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'teal-docker-archive-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const digest = createHash('sha256').update(config).digest('hex')
  const path = configPath ?? `${digest}.json`
  const root = join(directory, 'root')
  await mkdir(join(root, path, '..'), { recursive: true })
  await writeFile(join(root, path), config)
  await writeFile(join(root, 'manifest.json'), JSON.stringify([{
    Config: manifestConfigPath ?? path,
    RepoTags: ['teal-docs:test'],
    Layers: [],
  }]))
  const archive = join(directory, 'image.tar')
  await createTar({ cwd: root, file: archive }, ['manifest.json', path])
  return { archive, imageId: `sha256:${digest}` }
}

async function ociIndexArchiveFixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'teal-oci-index-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const root = join(directory, 'root')
  const blobs = join(root, 'blobs', 'sha256')
  await mkdir(blobs, { recursive: true })

  async function writeBlob(body) {
    const digest = createHash('sha256').update(body).digest('hex')
    await writeFile(join(blobs, digest), body)
    return { digest: `sha256:${digest}`, size: Buffer.byteLength(body) }
  }

  const config = '{"architecture":"amd64","os":"linux"}\n'
  const configDescriptor = await writeBlob(config)
  const platformManifest = `${JSON.stringify({
    schemaVersion: 2,
    mediaType: 'application/vnd.oci.image.manifest.v1+json',
    config: {
      mediaType: 'application/vnd.oci.image.config.v1+json',
      ...configDescriptor,
    },
    layers: [],
  }, null, 2)}\n`
  const platformDescriptor = await writeBlob(platformManifest)
  const imageIndex = `${JSON.stringify({
    schemaVersion: 2,
    mediaType: 'application/vnd.oci.image.index.v1+json',
    manifests: [{
      mediaType: 'application/vnd.oci.image.manifest.v1+json',
      ...platformDescriptor,
      platform: { architecture: 'amd64', os: 'linux' },
    }],
  }, null, 2)}\n`
  const imageDescriptor = await writeBlob(imageIndex)
  await writeFile(join(root, 'index.json'), `${JSON.stringify({
    schemaVersion: 2,
    mediaType: 'application/vnd.oci.image.index.v1+json',
    manifests: [{
      mediaType: 'application/vnd.oci.image.index.v1+json',
      ...imageDescriptor,
    }],
  })}\n`)
  await writeFile(join(root, 'manifest.json'), JSON.stringify([{
    Config: `blobs/sha256/${configDescriptor.digest.slice('sha256:'.length)}`,
    RepoTags: ['teal-docs:test'],
    Layers: [],
  }]))
  const archive = join(directory, 'image.tar')
  await createTar({ cwd: root, file: archive }, ['index.json', 'manifest.json', 'blobs'])
  return { archive, configImageId: configDescriptor.digest, imageId: imageDescriptor.digest }
}

test('binds a single Docker archive config digest to the inspected image ID', async (t) => {
  const fixture = await archiveFixture(t)
  await assert.doesNotReject(
    verifyDockerArchiveImageId(fixture.archive, fixture.imageId),
  )
})

test('binds a BuildKit OCI index image ID through its platform manifest to the archive config', async (t) => {
  const fixture = await ociIndexArchiveFixture(t)
  const verified = await verifyDockerArchiveImageId(fixture.archive, fixture.imageId)
  assert.equal(verified.imageId, fixture.imageId)
  assert.equal(verified.configImageId, fixture.configImageId)
})

test('rejects an archive whose config digest differs from the inspected image ID', async (t) => {
  const fixture = await archiveFixture(t)
  await assert.rejects(
    verifyDockerArchiveImageId(fixture.archive, `sha256:${'f'.repeat(64)}`),
    /archive config digest mismatch/i,
  )
})

test('rejects unsafe config paths and multi-image archives', async (t) => {
  const unsafe = await archiveFixture(t, { manifestConfigPath: '../outside.json' })
  await assert.rejects(
    verifyDockerArchiveImageId(unsafe.archive, unsafe.imageId),
    /unsafe Docker archive config path/i,
  )

  const fixture = await archiveFixture(t)
  const directory = await mkdtemp(join(tmpdir(), 'teal-docker-multi-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  await writeFile(join(directory, 'manifest.json'), JSON.stringify([
    { Config: 'a.json', RepoTags: ['one'], Layers: [] },
    { Config: 'b.json', RepoTags: ['two'], Layers: [] },
  ]))
  await writeFile(join(directory, 'a.json'), '{}')
  await writeFile(join(directory, 'b.json'), '{}')
  const archive = join(directory, 'multi.tar')
  await createTar({ cwd: directory, file: archive }, ['manifest.json', 'a.json', 'b.json'])
  await assert.rejects(
    verifyDockerArchiveImageId(archive, fixture.imageId),
    /exactly one image/i,
  )
})
