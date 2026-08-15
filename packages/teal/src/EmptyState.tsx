import { CircleCheck, CircleX, FileQuestion, Inbox, Info, Lock, ServerCrash, TriangleAlert } from 'lucide-react'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export type EmptyStateStatus = 'success' | 'error' | 'warning' | 'info' | '404' | '403' | '500'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Call to action rendered below the description. */
  action?: ReactNode
  /** Supporting text that explains the empty state. */
  description?: ReactNode
  /** Icon rendered above the title. Overrides the status's standard icon. */
  icon?: ReactNode
  /** Outcome status; picks the default icon and its tint. */
  status?: EmptyStateStatus
  /** Short heading for the empty state. */
  title: ReactNode
  /** Heading element used for the title; defaults to 'h3'. Adjust to fit the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const statusIcons: Record<EmptyStateStatus, typeof Info> = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
  '404': FileQuestion,
  '403': Lock,
  '500': ServerCrash,
}

const statusIconClasses: Record<EmptyStateStatus, string> = {
  success: 'teal-u-text-tertiary',
  error: 'teal-u-text-error',
  warning: 'teal-u-text-warning',
  info: 'teal-u-text-primary',
  '404': 'teal-u-text-on-surface-variant',
  '403': 'teal-u-text-warning',
  '500': 'teal-u-text-error',
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { action, className, description, icon, status, title, titleAs: TitleTag = 'h3', ...props },
  ref,
) {
  const StatusIcon = status ? statusIcons[status] : Inbox

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
        className={cn(
          'teal-u-flex teal-u-size-12 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-bg-surface-container-high [&_svg]:teal-u-size-[var(--teal-icon-lg)]',
          status ? statusIconClasses[status] : 'teal-u-text-on-surface-variant',
        )}
      >
        {icon ?? (status ? <StatusIcon className={statusIconClasses[status]} /> : <StatusIcon />)}
      </div>
      <TitleTag className="teal-u-mt-4 teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">{title}</TitleTag>
      {description ? <p className="teal-u-mt-1 teal-u-max-w-sm teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">{description}</p> : null}
      {action ? <div className="teal-u-mt-5">{action}</div> : null}
    </div>
  )
})
