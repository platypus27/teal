import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export type TimelineTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

export interface TimelineItem {
  /** Stable key for the entry. */
  id: string
  /** Heading of the entry. */
  title: ReactNode
  /** Optional supporting text rendered under the title. */
  description?: ReactNode
  /** Time label rendered under the description. */
  timestamp: ReactNode
  /** Color tone of the dot; defaults to `neutral`. */
  tone?: TimelineTone
}

const toneClasses: Record<TimelineTone, string> = {
  neutral: 'teal-u-bg-outline',
  primary: 'teal-u-bg-primary',
  success: 'teal-u-bg-emerald-500',
  warning: 'teal-u-bg-amber-500',
  danger: 'teal-u-bg-error',
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  /** Entries to render, in display order. */
  items: TimelineItem[]
}

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { className, items, ...props },
  ref,
) {
  return (
    <ol ref={ref} className={cn('teal-u-flex teal-u-flex-col', className)} {...props}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li key={item.id} className="teal-u-grid teal-u-grid-cols-[1rem_1fr] teal-u-gap-3">
            <span aria-hidden="true" className="teal-u-flex teal-u-flex-col teal-u-items-center teal-u-pt-[0.35rem]">
              <span
                className={cn(
                  'teal-u-size-2.5 teal-u-shrink-0 teal-u-rounded-full',
                  toneClasses[item.tone ?? 'neutral'],
                )}
              />
              {!isLast ? <span className="teal-u-mt-1 teal-u-w-px teal-u-flex-1 teal-u-bg-outline-variant/60" /> : null}
            </span>
            <div className={cn('teal-u-grid teal-u-gap-0.5', !isLast && 'teal-u-pb-6')}>
              <span className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{item.title}</span>
              {item.description ? (
                <span className="teal-u-text-sm teal-u-text-on-surface-variant">{item.description}</span>
              ) : null}
              <span className="teal-u-text-xs teal-u-tabular-nums teal-u-text-on-surface-variant">{item.timestamp}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
})
