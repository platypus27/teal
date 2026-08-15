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

  if (exampleIndex === 2) {
    return (
      <Card
        className="w-full max-w-md"
        title="Storage usage"
        actions={
          <Button size="sm" variant="ghost">
            Manage
          </Button>
        }
      >
        <p className="text-sm text-teal-on-surface-variant">
          You have used 6.2 GB of your 10 GB quota. Older backups are archived automatically.
        </p>
      </Card>
    )
  }

  if (exampleIndex === 3) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-teal-400 via-sky-400 to-indigo-400 p-10">
        <Card variant="glass">
          <p className="text-sm font-semibold text-teal-on-surface">Signed in as Mina</p>
          <p className="mt-1 text-sm text-teal-on-surface-variant">
            A frosted surface with a translucent background, border highlight, and soft overlay shadow.
          </p>
        </Card>
      </div>
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
