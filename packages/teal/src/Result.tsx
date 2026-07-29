import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { CircleCheck, CircleX, FileQuestion, Info, Lock, ServerCrash, TriangleAlert } from 'lucide-react'
import { cn } from './cn'

export type ResultStatus = 'success' | 'error' | 'warning' | 'info' | '404' | '403' | '500'

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Action area rendered below the description, typically Buttons. */
  actions?: ReactNode
  /** Supporting text that explains the outcome. */
  description?: ReactNode
  /** Icon override; defaults to the status's standard icon. Always hidden from assistive technology. */
  icon?: ReactNode
  /** Outcome shown; picks the default icon and its tint. */
  status: ResultStatus
  /** Short heading for the outcome. */
  title: ReactNode
}

const statusIcons: Record<ResultStatus, typeof Info> = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
  '404': FileQuestion,
  '403': Lock,
  '500': ServerCrash,
}

const statusIconClasses: Record<ResultStatus, string> = {
  success: 'teal-u-text-tertiary',
  error: 'teal-u-text-error',
  warning: 'teal-u-text-warning',
  info: 'teal-u-text-primary',
  '404': 'teal-u-text-on-surface-variant',
  '403': 'teal-u-text-warning',
  '500': 'teal-u-text-error',
}

export const Result = forwardRef<HTMLDivElement, ResultProps>(function Result(
  { actions, className, description, icon, status, title, ...props },
  ref,
) {
  const StatusIcon = statusIcons[status]

  return (
    <div
      ref={ref}
      className={cn('teal-u-flex teal-u-flex-col teal-u-items-center teal-u-justify-center teal-u-p-10 teal-u-text-center', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn('teal-u-flex teal-u-items-center teal-u-justify-center [&_svg]:teal-u-size-[var(--teal-icon-xl)]', statusIconClasses[status])}
      >
        {icon ?? <StatusIcon />}
      </span>
      <p className="teal-u-mt-4 teal-u-font-headline teal-u-text-xl teal-u-font-bold teal-u-text-on-surface">{title}</p>
      {description ? <p className="teal-u-mt-2 teal-u-max-w-md teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">{description}</p> : null}
      {actions ? <div className="teal-u-mt-6 teal-u-flex teal-u-flex-wrap teal-u-justify-center teal-u-gap-2">{actions}</div> : null}
    </div>
  )
})
