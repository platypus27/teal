function validArtifact(artifact) {
  return artifact
    && artifact.name === '@kryv/teal'
    && /^0\.\d+\.\d+$/.test(artifact.version)
    && /^[0-9a-f]{40}$/.test(artifact.sourceCommit)
    && /^sha512-[A-Za-z0-9+/]{86}==$/.test(artifact.integrity)
}

function exactRegistryArtifact(artifact, registry) {
  if (
    registry?.name !== artifact.name
    || registry?.version !== artifact.version
    || registry?.gitHead !== artifact.sourceCommit
    || registry?.dist?.integrity !== artifact.integrity
  ) {
    return false
  }
  try {
    const attestation = new URL(registry.dist.attestations.url)
    const attestedPackage = decodeURIComponent(
      attestation.pathname.slice('/-/npm/v1/attestations/'.length),
    )
    return attestation.origin === 'https://registry.npmjs.org'
      && !attestation.username
      && !attestation.password
      && !attestation.search
      && !attestation.hash
      && attestation.pathname.startsWith('/-/npm/v1/attestations/')
      && attestedPackage === `${artifact.name}@${artifact.version}`
      && registry.dist.attestations.provenance?.predicateType === 'https://slsa.dev/provenance/v1'
  } catch {
    return false
  }
}

export function decideReleaseMode({
  artifact,
  hasChangesets,
  registry,
  release,
  tagCommit,
}) {
  if (!validArtifact(artifact)) throw new Error('Reviewed release artifact is invalid')
  if (hasChangesets === true) return 'version'
  if (hasChangesets !== false) throw new Error('Changeset state is invalid')
  if (registry === undefined || registry === null) return 'publish'
  if (!exactRegistryArtifact(artifact, registry)) {
    throw new Error('Published registry version conflicts with reviewed artifact')
  }
  if (tagCommit !== undefined && tagCommit !== artifact.sourceCommit) {
    throw new Error('Existing release tag conflicts with reviewed commit')
  }
  if (
    release !== undefined
    && (
      release?.tag_name !== `v${artifact.version}`
      || release.draft !== false
      || release.prerelease !== false
    )
  ) {
    throw new Error('Existing GitHub release conflicts with reviewed version')
  }
  return tagCommit === artifact.sourceCommit && release !== undefined
    ? 'none'
    : 'reconcile'
}

export async function reconcileGitHubRelease(artifact, adapter) {
  if (!validArtifact(artifact)) throw new Error('Reviewed release artifact is invalid')
  let tagCommit = await adapter.inspectTag(artifact)
  if (tagCommit === undefined || tagCommit === null) {
    await adapter.createTag(artifact)
    tagCommit = await adapter.inspectTag(artifact)
  }
  if (tagCommit !== artifact.sourceCommit) {
    throw new Error('Existing release tag conflicts with reviewed commit')
  }

  let release = await adapter.inspectRelease(artifact)
  if (release === undefined || release === null) {
    await adapter.createRelease(artifact)
    release = await adapter.inspectRelease(artifact)
  }
  if (
    release?.tag_name !== `v${artifact.version}`
    || release.draft !== false
    || release.prerelease !== false
  ) {
    throw new Error('Existing GitHub release conflicts with reviewed version')
  }
  return { release, tagCommit }
}
