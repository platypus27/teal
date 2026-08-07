import { forwardRef, useId, type HTMLAttributes } from 'react'
import { cn } from './cn'

const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'] as const

const strengthColors = [
  'teal-u-bg-error',
  'teal-u-bg-error',
  'teal-u-bg-warning',
  'teal-u-bg-tertiary',
  'teal-u-bg-tertiary',
] as const

/** Simple heuristic: rewards length plus character variety, returning 0–4. */
export function defaultPasswordScore(password: string): number {
  if (password === '') return 0
  let points = 0
  if (password.length >= 8) points += 1
  if (password.length >= 12) points += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1
  if (/\d/.test(password)) points += 1
  if (/[^A-Za-z0-9]/.test(password)) points += 1
  return Math.min(4, points)
}

export interface PasswordStrengthMeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible name for the meter. */
  label?: string
  /** Password to score. */
  password: string
  /** Custom scoring function returning 0 (very weak) to 4 (very strong). */
  score?: (password: string) => number
  /** Hides the visible strength text; assistive technology still hears it via aria-valuetext. */
  showLabel?: boolean
}

export const PasswordStrengthMeter = forwardRef<HTMLDivElement, PasswordStrengthMeterProps>(
  function PasswordStrengthMeter(
    { className, label = 'Password strength', password, score = defaultPasswordScore, showLabel = true, ...props },
    ref,
  ) {
    const labelId = useId()
    const clamped = Math.max(0, Math.min(4, Math.round(score(password))))
    const strengthText = strengthLabels[clamped] ?? 'Very weak'
    const percentage = (clamped / 4) * 100

    return (
      <div ref={ref} className={cn('teal-u-grid teal-u-gap-1.5', className)} {...props}>
        <div className="teal-u-flex teal-u-items-baseline teal-u-justify-between teal-u-gap-4">
          <span id={labelId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
            {label}
          </span>
          {showLabel ? (
            <span className="teal-u-text-sm teal-u-font-medium teal-u-text-on-surface-variant">{strengthText}</span>
          ) : null}
        </div>
        <div
          role="progressbar"
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={clamped}
          aria-valuetext={strengthText}
          className="teal-u-h-2 teal-u-overflow-hidden teal-u-rounded-full teal-u-bg-surface-container-high"
        >
          <div
            className={cn(
              'teal-u-h-full teal-u-rounded-full teal-u-transition-[width] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
              strengthColors[clamped],
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  },
)
