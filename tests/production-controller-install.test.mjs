import assert from 'node:assert/strict'
import { generateKeyPairSync } from 'node:crypto'
import { constants } from 'node:fs'
import {
  access,
  chmod,
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readFile,
  readlink,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

import { approvalPublicKey } from '../scripts/owner-approval.mjs'
import { buildProductionController } from '../scripts/build_production_controller.mjs'
import { installProductionController } from '../scripts/install_production_controller.mjs'

const sourceFiles = [
  'scripts/assemble-release-candidate.mjs',
  'scripts/docker-archive.mjs',
  'scripts/kryv_teal_production_controller.mjs',
  'scripts/owner-approval.mjs',
  'scripts/teal_owner_authority.mjs',
  'scripts/teal_release_candidate.mjs',
  'infra/systemd/kryv-teal-production-observation.service',
  'infra/systemd/kryv-teal-production-observation.timer',
  'infra/sudoers.d/kryv-teal-production-controller',
]

async function readTestFile(path, encoding) {
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    return { contents: await file.readFile(encoding), metadata: await file.stat() }
  } finally {
    await file.close()
  }
}

async function makeTreeWritable(path) {
  let metadata
  try {
    metadata = await lstat(path)
  } catch (error) {
    if (error?.code === 'ENOENT') return
    throw error
  }
  if (metadata.isSymbolicLink()) return
  if (!metadata.isDirectory()) {
    await chmod(path, 0o600)
    return
  }
  await chmod(path, 0o700)
  for (const entry of await readdir(path)) await makeTreeWritable(join(path, entry))
}

async function workspaceFixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'teal-controller-build-'))
  const workspaceRoot = join(root, 'workspace')
  await mkdir(workspaceRoot)
  for (const path of sourceFiles) {
    const destination = join(workspaceRoot, path)
    await mkdir(dirname(destination), { recursive: true })
    await copyFile(new URL(`../${path}`, import.meta.url), destination)
  }
  const { publicKey } = generateKeyPairSync('ed25519')
  const publicKeyPem = publicKey.export({ format: 'pem', type: 'spki' })
  const fingerprint = approvalPublicKey(publicKeyPem).fingerprint
  const trustAnchor = {
    schemaVersion: 2,
    algorithm: 'Ed25519',
    owner: 'kryv-owner',
    publicKeyFingerprint: fingerprint,
    repository: 'platypus27/teal',
  workflow: 'platypus27/teal/.github/workflows/protected-release.yml',
    ref: 'refs/heads/master',
    operationEnvironments: {
      'npm-publish': 'teal-release',
      'docs-deploy': 'teal-production',
    },
  }
  await mkdir(join(workspaceRoot, 'infra'), { recursive: true })
  await writeFile(
    join(workspaceRoot, 'infra/release-owner-approval.json'),
    `${JSON.stringify(trustAnchor, null, 2)}\n`,
  )
  t.after(async () => {
    await makeTreeWritable(root)
    await rm(root, { recursive: true, force: true })
  })
  return { fingerprint, publicKeyPem, root, workspaceRoot }
}

test('builds a byte-reproducible fixed controller archive with an exact file closure', async (t) => {
  const fixture = await workspaceFixture(t)
  const first = join(fixture.root, 'first.tar')
  const second = join(fixture.root, 'second.tar')
  const one = await buildProductionController({ output: first, workspaceRoot: fixture.workspaceRoot })
  const two = await buildProductionController({ output: second, workspaceRoot: fixture.workspaceRoot })

  assert.equal(one.archiveSha256, two.archiveSha256)
  assert.deepEqual(await readFile(first), await readFile(second))
  assert.deepEqual(one.files.map(({ path }) => path), [
    'config/kryv-teal-production-controller.sudoers',
    'config/kryv-teal-production-observation.service',
    'config/kryv-teal-production-observation.timer',
    'config/release-owner-approval.json',
    'lib/assemble-release-candidate.mjs',
    'lib/docker-archive.mjs',
    'lib/kryv_teal_production_controller.mjs',
    'lib/owner-approval.mjs',
    'lib/teal_owner_authority.mjs',
    'lib/teal_release_candidate.mjs',
  ])
})

test('rejects controller sources reached through a symlinked workspace ancestor', async (t) => {
  const fixture = await workspaceFixture(t)
  const workspaceAlias = join(fixture.root, 'workspace-alias')
  await symlink(fixture.workspaceRoot, workspaceAlias, 'dir')

  await assert.rejects(
    buildProductionController({
      output: join(fixture.root, 'controller.tar'),
      workspaceRoot: workspaceAlias,
    }),
    /bounded canonical regular file/i,
  )
})

test('installs an exact archive into root-owned fixed paths and pins the owner key', async (t) => {
  const fixture = await workspaceFixture(t)
  const archive = join(fixture.root, 'controller.tar')
  const built = await buildProductionController({ output: archive, workspaceRoot: fixture.workspaceRoot })
  const targetRoot = join(fixture.root, 'target')
  await mkdir(targetRoot, { mode: 0o700 })

  const installed = await installProductionController({
    activate: false,
    archive,
    archiveSha256: built.archiveSha256,
    ownerPublicKeyPem: fixture.publicKeyPem,
    requiredOwnerUid: process.getuid(),
    targetRoot,
  })

  assert.equal(installed.archiveSha256, built.archiveSha256)
  assert.equal(installed.publicKeyFingerprint, fixture.fingerprint)
  const paths = {
    current: join(targetRoot, 'usr/local/share/kryv-teal-production/current'),
    key: join(targetRoot, 'usr/local/share/kryv-teal-production/current/config/owner.pub.pem'),
    ledger: join(targetRoot, 'var/lib/kryv-teal-production/consumed-approvals'),
    state: join(targetRoot, 'var/lib/kryv-teal-production'),
    sudoers: join(targetRoot, 'etc/sudoers.d/kryv-teal-production-controller'),
    timer: join(targetRoot, 'etc/systemd/system/kryv-teal-production-observation.timer'),
    wrapper: join(targetRoot, 'usr/local/libexec/kryv-teal-production-controller'),
  }
  assert.equal((await lstat(paths.key)).mode & 0o777, 0o400)
  assert.equal((await lstat(paths.ledger)).mode & 0o777, 0o700)
  assert.equal((await lstat(paths.state)).mode & 0o777, 0o700)
  const sudoers = await readTestFile(paths.sudoers, 'utf8')
  assert.equal(sudoers.metadata.mode & 0o777, 0o440)
  assert.equal((await lstat(paths.timer)).mode & 0o777, 0o444)
  const wrapperFile = await readTestFile(paths.wrapper, 'utf8')
  assert.equal(wrapperFile.metadata.mode & 0o777, 0o555)
  const wrapper = wrapperFile.contents
  assert.match(wrapper, /\/usr\/bin\/flock/)
  assert.match(wrapper, /--jitless/)
  assert.match(wrapper, /test "\$\(\/usr\/bin\/node --version\)" = v24\.19\.0/)
  assert.match(wrapper, /\/usr\/local\/share\/kryv-teal-production\/current/)
  assert.equal(
    await readlink(paths.current),
    join('generations', built.archiveSha256.slice('sha256:'.length)),
  )
  assert.match(sudoers.contents, /%teal-production-runner/)
  const versionRoot = join(
    targetRoot,
    'usr/local/share/kryv-teal-production/generations',
    built.archiveSha256.slice('sha256:'.length),
  )
  await assert.doesNotReject(import(
    `${pathToFileURL(join(versionRoot, 'lib/kryv_teal_production_controller.mjs')).href}?archive=${built.archiveSha256}`,
  ))
  await chmod(versionRoot, 0o777)
  await assert.rejects(
    installProductionController({
      activate: false,
      archive,
      archiveSha256: built.archiveSha256,
      ownerPublicKeyPem: fixture.publicKeyPem,
      requiredOwnerUid: process.getuid(),
      targetRoot,
    }),
    /controller version directory is untrusted/i,
  )
  await chmod(versionRoot, 0o700)
})

test('activates one immutable generation selector and rejects partial bootstrap changes', async (t) => {
  const fixture = await workspaceFixture(t)
  const targetRoot = join(fixture.root, 'target')
  await mkdir(targetRoot, { mode: 0o700 })
  const firstArchive = join(fixture.root, 'first-controller.tar')
  const first = await buildProductionController({ output: firstArchive, workspaceRoot: fixture.workspaceRoot })
  await installProductionController({
    activate: false,
    archive: firstArchive,
    archiveSha256: first.archiveSha256,
    ownerPublicKeyPem: fixture.publicKeyPem,
    requiredOwnerUid: process.getuid(),
    targetRoot,
  })
  const selector = join(targetRoot, 'usr/local/share/kryv-teal-production/current')

  const controllerSource = join(fixture.workspaceRoot, 'scripts/kryv_teal_production_controller.mjs')
  await writeFile(controllerSource, `${await readFile(controllerSource, 'utf8')}\n// immutable generation two\n`)
  const secondArchive = join(fixture.root, 'second-controller.tar')
  const second = await buildProductionController({ output: secondArchive, workspaceRoot: fixture.workspaceRoot })
  await installProductionController({
    activate: false,
    archive: secondArchive,
    archiveSha256: second.archiveSha256,
    ownerPublicKeyPem: fixture.publicKeyPem,
    requiredOwnerUid: process.getuid(),
    targetRoot,
  })
  assert.equal(
    await readlink(selector),
    join('generations', second.archiveSha256.slice('sha256:'.length)),
  )
  await access(join(
    targetRoot,
    'usr/local/share/kryv-teal-production/generations',
    first.archiveSha256.slice('sha256:'.length),
  ))

  const sudoersSource = join(fixture.workspaceRoot, 'infra/sudoers.d/kryv-teal-production-controller')
  await writeFile(sudoersSource, `${await readFile(sudoersSource, 'utf8')}\n# forbidden live bootstrap drift\n`)
  const conflictingArchive = join(fixture.root, 'conflicting-controller.tar')
  const conflicting = await buildProductionController({
    output: conflictingArchive,
    workspaceRoot: fixture.workspaceRoot,
  })
  await assert.rejects(
    installProductionController({
      activate: false,
      archive: conflictingArchive,
      archiveSha256: conflicting.archiveSha256,
      ownerPublicKeyPem: fixture.publicKeyPem,
      requiredOwnerUid: process.getuid(),
      targetRoot,
    }),
    /bootstrap.*conflict|conflict.*bootstrap/i,
  )
  assert.equal(
    await readlink(selector),
    join('generations', second.archiveSha256.slice('sha256:'.length)),
  )
})

test('rejects a changed archive digest and a public key outside the pinned trust anchor', async (t) => {
  const fixture = await workspaceFixture(t)
  const archive = join(fixture.root, 'controller.tar')
  const built = await buildProductionController({ output: archive, workspaceRoot: fixture.workspaceRoot })
  const targetRoot = join(fixture.root, 'target')
  await mkdir(targetRoot, { mode: 0o700 })

  await assert.rejects(
    installProductionController({
      activate: false,
      archive,
      archiveSha256: `sha256:${'0'.repeat(64)}`,
      ownerPublicKeyPem: fixture.publicKeyPem,
      requiredOwnerUid: process.getuid(),
      targetRoot,
    }),
    /archive digest/i,
  )
  const { publicKey } = generateKeyPairSync('ed25519')
  await assert.rejects(
    installProductionController({
      activate: false,
      archive,
      archiveSha256: built.archiveSha256,
      ownerPublicKeyPem: publicKey.export({ format: 'pem', type: 'spki' }),
      requiredOwnerUid: process.getuid(),
      targetRoot,
    }),
    /fingerprint/i,
  )
})
