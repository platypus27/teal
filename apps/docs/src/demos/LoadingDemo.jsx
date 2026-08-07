import { LoadingState, Progress, Skeleton, Spinner } from '@kryv/teal'

export function LoadingDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-lg gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    )
  }
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
