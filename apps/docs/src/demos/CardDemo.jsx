import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@kryv/teal'

export function CardDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="flex-col items-start justify-start gap-1.5">
          <CardTitle>Weekly summary</CardTitle>
          <CardDescription>March 2 – March 8</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-teal-on-surface">
            Uptime held at 99.98% with two resolved incidents and no customer impact.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="secondary">
            Download summary
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex-col items-start justify-start gap-1.5">
        <CardTitle>Security report</CardTitle>
        <CardDescription>Updated five minutes ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-teal-on-surface">No critical findings were detected.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          View report
        </Button>
      </CardFooter>
    </Card>
  )
}
