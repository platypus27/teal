import { Grid } from '@kryv/teal'

const tiles = ['Reports', 'Members', 'Security', 'Billing', 'Usage', 'Audit log']

export function GridDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Grid columns={3} gap={3} className="w-full">
        {tiles.map((tile) => (
          <span key={tile} className="rounded-lg border border-teal-outline-variant/50 px-3 py-4 text-center text-sm">
            {tile}
          </span>
        ))}
      </Grid>
    )
  }

  return (
    <Grid minChildWidth="9rem" gap={3} className="w-full">
      {tiles.map((tile) => (
        <span key={tile} className="rounded-lg border border-teal-outline-variant/50 px-3 py-4 text-center text-sm">
          {tile}
        </span>
      ))}
    </Grid>
  )
}
