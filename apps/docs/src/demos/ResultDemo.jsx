import { Button, Result } from '@kryv/teal'

export function ResultDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Result
        status="404"
        title="Page not found"
        description="The report may have been moved or deleted."
        actions={<Button variant="secondary">Back to projects</Button>}
      />
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="grid gap-10">
        <Result
          status="404"
          title="Route not found"
          description="The link may be outdated or the page removed."
          actions={<Button variant="secondary">Back to dashboard</Button>}
        />
        <Result
          status="403"
          title="Access restricted"
          description="You need the security role to open this area."
          actions={<Button variant="secondary">Request access</Button>}
        />
        <Result
          status="500"
          title="Something went wrong"
          description="The server hit an unexpected error while loading the report."
          actions={<Button variant="secondary">Retry request</Button>}
        />
      </div>
    )
  }

  return (
    <Result
      status="success"
      title="Report published"
      description="The quarterly security report is now visible to all workspace members."
      actions={
        <>
          <Button>View report</Button>
          <Button variant="secondary">Back to reports</Button>
        </>
      }
    />
  )
}
