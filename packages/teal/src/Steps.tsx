import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from './cn'

export interface StepItem {
  /** Short name of the step, rendered next to its indicator. */
  label: ReactNode
  /** Optional supporting text rendered under the label. */
  description?: ReactNode
}

export interface StepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'onChange'> {
  /** Steps to render, in order. */
  steps: StepItem[]
  /** Zero-based index of the current step. Earlier steps render as completed. */
  current: number
  /** When provided, completed steps render as buttons and call this with their index. */
  onStepClick?: (index: number) => void
}

export const Steps = forwardRef<HTMLOListElement, StepsProps>(function Steps(
  { className, current, onStepClick, steps, ...props },
  ref,
) {
  return (
    <ol
      ref={ref}
      className={cn('teal-u-flex teal-u-flex-wrap teal-u-items-center teal-u-gap-x-2 teal-u-gap-y-3', className)}
      {...props}
    >
      {steps.map((step, index) => {
        const done = index < current
        const isCurrent = index === current
        const clickable = done && onStepClick

        const indicator = (
          <span
            aria-hidden="true"
            className={cn(
              'teal-u-grid teal-u-size-7 teal-u-shrink-0 teal-u-place-items-center teal-u-rounded-full teal-u-text-xs teal-u-font-bold',
              done && 'teal-u-bg-primary teal-u-text-on-primary',
              isCurrent && 'teal-u-border-2 teal-u-border-solid teal-u-border-primary teal-u-bg-surface teal-u-text-primary',
              !done && !isCurrent && 'teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-text-on-surface-variant',
            )}
          >
            {done ? (
              <span className="teal-check-indicator">
                <Check className="teal-u-size-[var(--teal-icon-sm)]" strokeWidth={3} />
              </span>
            ) : (
              index + 1
            )}
          </span>
        )

        const text = (
          <span className="teal-u-grid teal-u-gap-0.5 teal-u-text-left">
            <span
              className={cn(
                'teal-u-text-sm teal-u-font-semibold',
                isCurrent ? 'teal-u-text-on-surface' : 'teal-u-text-on-surface-variant',
              )}
            >
              {step.label}
            </span>
            {step.description ? (
              <span className="teal-u-text-xs teal-u-text-on-surface-variant">{step.description}</span>
            ) : null}
          </span>
        )

        return (
          <li
            key={index}
            aria-current={isCurrent ? 'step' : undefined}
            className="teal-u-flex teal-u-min-w-0 teal-u-flex-1 teal-u-items-center teal-u-gap-2 last:teal-u-flex-none"
          >
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className="teal-focus-ring teal-u-flex teal-u-items-center teal-u-gap-2 teal-u-rounded-lg"
              >
                {indicator}
                {text}
              </button>
            ) : (
              <span className="teal-u-flex teal-u-items-center teal-u-gap-2">
                {indicator}
                {text}
              </span>
            )}
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="teal-u-h-px teal-u-min-w-4 teal-u-flex-1 teal-u-bg-outline-variant/60" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
})
