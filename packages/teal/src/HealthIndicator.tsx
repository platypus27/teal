import { forwardRef, type ReactNode } from 'react'
import { Badge } from './Badge'
import { cn } from './cn'

export type HealthIndicatorStatus = 'healthy' | 'degraded' | 'down' | 'stale' | 'unknown' | 'loading'

const statusPresentation: Record<
  HealthIndicatorStatus,
  { text: string; variant: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }
> = {
  healthy: { text: 'Healthy', variant: 'success' },
  degraded: { text: 'Degraded', variant: 'warning' },
  down: { text: 'Down', variant: 'danger' },
  stale: { text: 'Stale', variant: 'info' },
  unknown: { text: 'Unknown', variant: 'neutral' },
  loading: { text: 'Checking', variant: 'neutral' },
}

export interface HealthIndicatorProps {
  className?: string
  /** Application name rendered beside the status. */
  label?: ReactNode
  /** Current health evidence. Missing evidence must be reported as 'unknown', never inferred as healthy. */
  status: HealthIndicatorStatus
}

export const HealthIndicator = forwardRef<HTMLSpanElement, HealthIndicatorProps>(function HealthIndicator(
  { className, label, status },
  ref,
) {
  const presentation = statusPresentation[status]
  return (
    <span ref={ref} className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-2', className)}>
      <Badge variant={presentation.variant}>{presentation.text}</Badge>
      {label ? <span className="teal-u-text-sm teal-u-text-on-surface-variant">{label}</span> : null}
    </span>
  )
})
