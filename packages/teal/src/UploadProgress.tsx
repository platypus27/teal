import { forwardRef, type HTMLAttributes } from 'react'
import { File, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

function defaultFormatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`
}

export interface UploadProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Name of the file being uploaded. */
  fileName: string
  /** Upload completion percentage; clamped between 0 and 100. */
  progress: number
  /** Total size of the file in bytes, shown formatted next to the percentage. */
  size?: number
  /** Formats the byte size for display. */
  formatSize?: (bytes: number) => string
  /** Renders a cancel button that calls this when pressed. */
  onCancel?: () => void
}

export const UploadProgress = forwardRef<HTMLDivElement, UploadProgressProps>(function UploadProgress(
  { className, fileName, formatSize = defaultFormatSize, onCancel, progress, size, ...props },
  ref,
) {
  const clamped = Math.min(100, Math.max(0, progress))
  return (
    <div
      ref={ref}
      className={cn(
        'teal-u-flex teal-u-items-center teal-u-gap-3 teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container teal-u-px-3 teal-u-py-2.5',
        className,
      )}
      {...props}
    >
      <File aria-hidden="true" className="teal-u-size-[var(--teal-icon-md)] teal-u-shrink-0 teal-u-text-on-surface-variant" />
      <div className="teal-u-grid teal-u-min-w-0 teal-u-flex-1 teal-u-gap-1">
        <div className="teal-u-flex teal-u-items-baseline teal-u-justify-between teal-u-gap-3">
          <span className="teal-u-truncate teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{fileName}</span>
          <span className="teal-u-shrink-0 teal-u-text-xs teal-u-tabular-nums teal-u-text-on-surface-variant">
            {size !== undefined ? `${formatSize(size)} · ` : ''}
            {Math.round(clamped)}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={`Uploading ${fileName}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(clamped)}
          className="teal-u-h-1.5 teal-u-overflow-hidden teal-u-rounded-full teal-u-bg-surface-container-high"
        >
          <div
            className="teal-u-h-full teal-u-rounded-full teal-u-bg-primary teal-u-transition-[width] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
      {onCancel ? (
        <IconButton label={`Cancel upload of ${fileName}`} size="sm" variant="ghost" onClick={onCancel}>
          <X />
        </IconButton>
      ) : null}
    </div>
  )
})
