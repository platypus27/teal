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
  if (exampleIndex === 2) {
    return (
      <div className="grid w-full max-w-lg gap-10">
        <EmptyState
          status="404"
          title="Route not found"
          description="The link may be outdated or the page removed."
          action={<Button variant="secondary">Back to dashboard</Button>}
        />
        <EmptyState
          status="403"
          title="Access restricted"
          description="You need the security role to open this area."
          action={<Button variant="secondary">Request access</Button>}
        />
        <EmptyState
          status="500"
          title="Something went wrong"
          description="The server hit an unexpected error while loading the report."
          action={<Button variant="secondary">Retry request</Button>}
        />
      </div>
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
