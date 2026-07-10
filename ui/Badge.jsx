import { cn } from './cn.js'

const TONES = {
  high: 'bg-error/10 text-error',
  critical: 'bg-error/10 text-error',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-tertiary/10 text-tertiary',
  success: 'bg-tertiary/10 text-tertiary',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-primary/10 text-primary',
  neutral: 'bg-surface-container-high text-on-surface-variant',
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase', TONES[tone] || TONES.neutral, className)}>
      {children}
    </span>
  )
}
