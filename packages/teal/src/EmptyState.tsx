import { Inbox } from 'lucide-react'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Call to action rendered below the description. */
  action?: ReactNode
  /** Supporting text that explains the empty state. */
  description?: ReactNode
  /** Icon rendered above the title. */
  icon?: ReactNode
  /** Short heading for the empty state. */
  title: ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { action, className, description, icon, title, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container p-10 text-center',
        className,
      )}
      {...props}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant [&_svg]:size-6">
        {icon ?? <Inbox aria-hidden="true" />}
      </div>
      <h3 className="mt-4 font-headline text-lg font-bold text-on-surface">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm leading-relaxed text-on-surface-variant">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
})
