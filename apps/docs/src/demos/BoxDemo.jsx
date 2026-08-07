import { Box } from '@kryv/teal'

export function BoxDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Box as="section" p={6} mx="auto" className="max-w-sm rounded-2xl border border-teal-outline-variant/50">
        <p className="font-semibold text-teal-on-surface">Semantic surface</p>
        <p className="mt-1 text-sm text-teal-on-surface-variant">
          Rendered as a section with centered margin and padding from props.
        </p>
      </Box>
    )
  }

  return (
    <div className="flex items-start gap-4">
      <Box p={4} className="rounded-xl bg-teal-surface-container">
        <span className="text-sm text-teal-on-surface">p=4</span>
      </Box>
      <Box px={8} py={2} className="rounded-xl bg-teal-surface-container-high">
        <span className="text-sm text-teal-on-surface">px=8 py=2</span>
      </Box>
    </div>
  )
}
