import { VoxelMotif, voxelMotifs } from '@kryv/teal'

/** @type {Record<import('@kryv/teal').VoxelMotifId, string>} */
const MOTIF_LABELS = {
  home: 'Home · lighthouse',
  'photos-tree': 'Photos · spirit tree',
  'photos-windmill': 'Photos · windmill',
  yang: 'Yang · beacon',
  trict: 'Trict · harbor chart',
  twinkle: 'Twinkle · fireflies',
}

export function VoxelMotifDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-end gap-8">
        <VoxelMotif motif="home" size={96} label="Home lighthouse motif" />
        <VoxelMotif motif="yang" size={64} />
      </div>
    )
  }

  const ids = /** @type {import('@kryv/teal').VoxelMotifId[]} */ (Object.keys(voxelMotifs))
  return (
    <div className="grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-3">
      {ids.map((id) => (
        <figure key={id} className="flex flex-col items-center gap-2">
          <VoxelMotif motif={id} size={104} label={MOTIF_LABELS[id]} />
          <figcaption className="text-xs text-teal-on-surface-variant">{MOTIF_LABELS[id]}</figcaption>
        </figure>
      ))}
    </div>
  )
}
