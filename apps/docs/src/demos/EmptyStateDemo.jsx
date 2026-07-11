import { Button, EmptyState } from '@kryv/teal'

export function EmptyStateDemo() {
  return (
    <EmptyState
      title="No reports"
      description="Create a report to begin tracking results."
      action={<Button>Create report</Button>}
      className="w-full max-w-lg"
    />
  )
}
