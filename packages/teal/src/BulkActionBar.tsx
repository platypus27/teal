import { forwardRef, type HTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from './cn'
import { Button } from './Button'

export interface BulkActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of selected rows; the bar renders nothing while this is 0. */
  count: number
  /** Accessible name for the bulk action region. */
  label?: string
  /** Called when the user clears the selection. */
  onClear?: () => void
}

export const BulkActionBar = forwardRef<HTMLDivElement, BulkActionBarProps>(function BulkActionBar(
  { children, className, count, label = 'Bulk actions', onClear, ...props },
  ref,
) {
  if (count <= 0) return null

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      className={cn(
        'teal-u-flex teal-u-items-center teal-u-gap-3 teal-u-rounded-2xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-low teal-u-px-4 teal-u-py-2',
        className,
      )}
      {...props}
    >
      <span aria-live="polite" className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
        {count} selected
      </span>
      <span aria-hidden="true" className="teal-u-h-5 teal-u-w-px teal-u-bg-[var(--teal-border-subtle)]" />
      <div className="teal-u-flex teal-u-flex-1 teal-u-items-center teal-u-gap-2">{children}</div>
      {onClear ? (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
          Clear
        </Button>
      ) : null}
    </div>
  )
})
