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
