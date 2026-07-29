import { ProgressCircle } from '@kryv/teal'

export function ProgressCircleDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <ProgressCircle size={72} strokeWidth={7} value={82} label="Storage used" />
        <ProgressCircle size={72} strokeWidth={7} label="Syncing files" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <ProgressCircle value={25} label="Quarter progress" />
      <ProgressCircle value={64} label="Upload progress" />
      <ProgressCircle value={100} label="Backup complete" />
      <ProgressCircle label="Loading reports" />
    </div>
  )
}
