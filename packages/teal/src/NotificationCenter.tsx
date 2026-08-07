import { forwardRef, type ReactElement, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { CheckCheck } from 'lucide-react'
import { Button } from './Button'
import { NotificationItem } from './NotificationItem'
import { cn } from './cn'

export interface NotificationCenterItem {
  /** Label of the source application, supplied sanitized by the caller. */
  appLabel: ReactNode
  /** URL of the notification deep link. */
  href: string
  /** Unique identifier for the notification. */
  id: string
  /** Unread notifications are emphasized until marked read. */
  read?: boolean | undefined
  /** Severity drives the indicator and icon of the row. */
  severity?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | undefined
  /** Human-readable timestamp supplied by the caller. */
  timestamp: ReactNode
  /** Notification title, supplied sanitized by the caller. */
  title: ReactNode
}

export interface NotificationCenterProps {
  /** Horizontal alignment of the panel relative to the trigger. */
  align?: 'start' | 'center' | 'end'
  className?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Content shown when there are no notifications. */
  emptyMessage?: ReactNode
  /** Notifications listed newest first. */
  items: NotificationCenterItem[]
  /** Accessible name of the popover panel. */
  label?: string
  /** Accessible label of the mark-all-read action. */
  markAllReadLabel?: string
  /** Renders the mark-all-read action and calls this when pressed. Never mutates the items. */
  onMarkAllRead?: () => void
  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Side of the trigger the panel opens on. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Element that toggles the panel; receives trigger props automatically. */
  trigger: ReactElement
}

/**
 * Popover panel listing recent notifications with a mark-all-read action.
 * Rows reuse NotificationItem; the panel never mutates the items itself.
 */
export const NotificationCenter = forwardRef<HTMLDivElement, NotificationCenterProps>(function NotificationCenter(
  {
    align = 'end',
    className,
    defaultOpen,
    emptyMessage = "You're all caught up",
    items,
    label = 'Notifications',
    markAllReadLabel = 'Mark all as read',
    onMarkAllRead,
    onOpenChange,
    open,
    side = 'bottom',
    trigger,
  },
  ref,
) {
  const hasUnread = items.some((item) => !item.read)

  return (
    <PopoverPrimitive.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          aria-label={label}
          align={align}
          side={side}
          sideOffset={6}
          className={cn(
            'teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-flex teal-u-w-[min(24rem,calc(100vw-2rem))] teal-u-flex-col teal-u-overflow-hidden teal-u-border teal-u-bg-surface teal-u-p-0 teal-u-text-on-surface teal-u-outline-none',
            className,
          )}
        >
          <div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-2 teal-u-border-0 teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-px-4 teal-u-py-3">
            <span className="teal-u-font-headline teal-u-text-sm teal-u-font-bold">{label}</span>
            {onMarkAllRead && hasUnread ? (
              <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
                <CheckCheck aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
                {markAllReadLabel}
              </Button>
            ) : null}
          </div>
          {items.length === 0 ? (
            <div className="teal-u-px-4 teal-u-py-10 teal-u-text-center teal-u-text-sm teal-u-text-on-surface-variant">
              {emptyMessage}
            </div>
          ) : (
            <ul aria-label={label} className="teal-u-m-0 teal-u-flex teal-u-max-h-96 teal-u-list-none teal-u-flex-col teal-u-gap-2 teal-u-overflow-y-auto teal-u-p-3">
              {items.map((item) => (
                <li key={item.id}>
                  <NotificationItem
                    appLabel={item.appLabel}
                    href={item.href}
                    timestamp={item.timestamp}
                    title={item.title}
                    {...(item.read !== undefined ? { read: item.read } : {})}
                    {...(item.severity !== undefined ? { severity: item.severity } : {})}
                  />
                </li>
              ))}
            </ul>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
})
