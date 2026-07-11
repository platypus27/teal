import { LoadingState, Progress, Skeleton, Spinner } from '@kryv/teal'

export function LoadingDemo() {
  return (
    <div className="grid w-full max-w-lg gap-5">
      <div className="flex items-center gap-5">
        <Spinner label="Loading example" />
        <Progress label="Import progress" value={64} />
      </div>
      <Skeleton className="h-20 w-full" />
      <LoadingState label="Loading reports" className="min-h-32" />
    </div>
  )
}
