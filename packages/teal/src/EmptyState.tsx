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
  /** Heading element used for the title; defaults to 'h3'. Adjust to fit the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { action, className, description, icon, title, titleAs: TitleTag = 'h3', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'teal-raised-surface teal-u-flex teal-u-flex-col teal-u-items-center teal-u-justify-center teal-u-border teal-u-border-dashed teal-u-bg-surface-container teal-u-p-10 teal-u-text-center teal-u-shadow-none',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="teal-u-flex teal-u-size-12 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-bg-surface-container-high teal-u-text-on-surface-variant [&_svg]:teal-u-size-[var(--teal-icon-lg)]"
      >
        {icon ?? <Inbox />}
      </div>
      <TitleTag className="teal-u-mt-4 teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">{title}</TitleTag>
      {description ? <p className="teal-u-mt-1 teal-u-max-w-sm teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">{description}</p> : null}
      {action ? <div className="teal-u-mt-5">{action}</div> : null}
    </div>
  )
})
