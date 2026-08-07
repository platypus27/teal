import { Container } from '@kryv/teal'

export function ContainerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full space-y-3">
        {(/** @type {Array<'sm' | 'md' | 'lg'>} */ (['sm', 'md', 'lg']).map((size) => (
          <Container key={size} size={size} className="rounded-lg bg-teal-surface-container py-2 text-center text-sm">
            size=&quot;{size}&quot;
          </Container>
        )))}
      </div>
    )
  }

  return (
    <Container className="rounded-xl border border-dashed border-teal-outline-variant/60 py-6 text-center">
      <p className="text-sm text-teal-on-surface-variant">
        Centered at max-w-6xl with responsive side padding.
      </p>
    </Container>
  )
}
