import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@kryv/teal'

export function CardDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex-col items-start justify-start gap-1.5">
        <CardTitle>Security report</CardTitle>
        <CardDescription>Updated five minutes ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-on-surface">No critical findings were detected.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          View report
        </Button>
      </CardFooter>
    </Card>
  )
}
