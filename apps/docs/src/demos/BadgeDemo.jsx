import { Badge } from '@kryv/teal'

/** @type {{ name: string, status: string, variant: 'success' | 'danger' | 'neutral' | 'info' | 'warning' }[]} */
const rows = [
  { name: 'Nightly backup', status: 'Succeeded', variant: 'success' },
  { name: 'Index rebuild', status: 'Running', variant: 'info' },
  { name: 'Cache warmup', status: 'Queued', variant: 'neutral' },
  { name: 'Schema migration', status: 'Failed', variant: 'danger' },
]

export function BadgeDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-md divide-y divide-teal-outline-variant/30 rounded-lg border border-teal-outline-variant/30">
        {rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
            <span className="text-teal-on-surface">{row.name}</span>
            <Badge variant={row.variant}>{row.status}</Badge>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <Badge>Neutral</Badge>
      <Badge variant="info">Information</Badge>
      <Badge variant="success">Ready</Badge>
      <Badge variant="warning">Attention</Badge>
      <Badge variant="danger">Action required</Badge>
    </>
  )
}
