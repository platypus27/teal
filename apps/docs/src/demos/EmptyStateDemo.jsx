import { Button, EmptyState } from '@kryv/teal'

export function EmptyStateDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <EmptyState
        title="No matching reports"
        description="No reports match the current filters. Adjust or clear them to see more results."
        action={<Button variant="secondary">Clear filters</Button>}
        className="w-full max-w-lg"
      />
    )
  }
  return (
    <EmptyState
      title="No reports"
      description="Create a report to begin tracking results."
      action={<Button>Create report</Button>}
      className="w-full max-w-lg"
    />
  )
}
