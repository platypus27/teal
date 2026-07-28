import { forwardRef, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Archive, BellOff, CheckCircle2, CircleAlert, Info, TriangleAlert } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

const notificationItemVariants = cva('teal-u-size-2 teal-u-rounded-full', {
  variants: {
    severity: {
      neutral: 'teal-u-bg-on-surface-variant',
      info: 'teal-u-bg-primary',
      success: 'teal-u-bg-tertiary',
      warning: 'teal-u-bg-warning',
      danger: 'teal-u-bg-error',
    },
  },
  defaultVariants: { severity: 'info' },
})

type NotificationSeverity = NonNullable<VariantProps<typeof notificationItemVariants>['severity']>

const severityIcons: Record<NotificationSeverity, typeof Info> = {
  neutral: Info,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: CircleAlert,
}

export interface NotificationItemProps {
  /** Label of the source application, supplied sanitized by the caller. */
  appLabel: ReactNode
  className?: string
  /** URL of the source application deep link. */
  href: string
  /** Renders an archive control and calls this when pressed. Never mutates the source event. */
  onArchive?: () => void
  /** Renders a mute control and calls this when pressed. Never mutates the source event. */
  onMute?: () => void
  /** Marks the item as read; unread items are emphasized and announce an unread marker. */
  read?: boolean
  /** Severity drives the indicator and icon. */
  severity?: NotificationSeverity
  /** Human-readable timestamp supplied by the caller. */
  timestamp: ReactNode
  /** Notification title, supplied sanitized by the caller. */
  title: ReactNode
}

export const NotificationItem = forwardRef<HTMLDivElement, NotificationItemProps>(
  function NotificationItem(
    { appLabel, className, href, onArchive, onMute, read = false, severity = 'info', timestamp, title },
    ref,
  ) {
    const SeverityIcon = severityIcons[severity]
    return (
      <div
        ref={ref}
        className={cn(
          'teal-raised-surface teal-u-flex teal-u-items-start teal-u-gap-3 teal-u-border teal-u-bg-surface-container teal-u-p-4 teal-u-text-sm teal-u-shadow-none',
          className,
        )}
      >
        <span aria-hidden="true" className={cn('teal-u-mt-1.5 teal-u-shrink-0', notificationItemVariants({ severity }))} />
        <SeverityIcon aria-hidden="true" className="teal-u-mt-0.5 teal-u-size-[var(--teal-icon-md)] teal-u-shrink-0 teal-u-text-on-surface-variant" />
        <div className="teal-u-min-w-0 teal-u-flex-1">
          <a
            href={href}
            className={cn(
              'teal-focus-ring teal-u-rounded teal-u-text-on-surface teal-u-no-underline hover:teal-u-underline',
              !read && 'teal-u-font-semibold',
            )}
          >
            {title}
            {!read ? <span className="teal-u-sr-only">{', unread'}</span> : null}
          </a>
          <div className="teal-u-mt-0.5 teal-u-flex teal-u-flex-wrap teal-u-items-center teal-u-gap-x-2 teal-u-text-xs teal-u-text-on-surface-variant">
            <span>{appLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{timestamp}</span>
          </div>
        </div>
        {onMute || onArchive ? (
          <div className="teal-u-flex teal-u-shrink-0 teal-u-gap-1">
            {onMute ? (
              <IconButton label="Mute" size="sm" variant="ghost" onClick={onMute}>
                <BellOff />
              </IconButton>
            ) : null}
            {onArchive ? (
              <IconButton label="Archive" size="sm" variant="ghost" onClick={onArchive}>
                <Archive />
              </IconButton>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
)

export { notificationItemVariants }
