import { forwardRef, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface DrawerProps {
  /** Body content of the drawer. */
  children: ReactNode
  className?: string
  /** Accessible label for the close button. */
  closeLabel?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Supporting text rendered under the title. */
  description?: ReactNode
  /** Action area rendered at the bottom of the drawer. */
  footer?: ReactNode
  /** Called when the drawer opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Edge of the viewport the drawer slides in from. */
  side?: 'left' | 'right'
  /** Title rendered at the top; also the accessible name of the drawer. */
  title?: ReactNode
  /** Width of the drawer surface. */
  width?: string
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    children,
    className,
    closeLabel = 'Close',
    defaultOpen,
    description,
    footer,
    onOpenChange,
    open,
    side = 'right',
    title,
    width = 'min(28rem,100vw)',
  },
  ref,
) {
  return (
    <DialogPrimitive.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/50 teal-u-backdrop-blur-sm" />
        <DialogPrimitive.Content
          ref={ref}
          data-side={side}
          style={{ width }}
          className={cn(
            'teal-drawer-content teal-u-fixed teal-u-inset-y-0 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-flex-col teal-u-border teal-u-bg-surface teal-u-shadow-overlay teal-u-text-on-surface teal-u-outline-none',
            side === 'right' ? 'teal-u-right-0 teal-u-border-l' : 'teal-u-left-0 teal-u-border-r',
            className,
          )}
        >
          <div className="teal-u-p-6 teal-u-pr-14">
            {title ? (
              <DialogPrimitive.Title className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
                {title}
              </DialogPrimitive.Title>
            ) : null}
            {description ? (
              <DialogPrimitive.Description className="teal-u-mt-2 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          <DialogPrimitive.Close asChild>
            <IconButton label={closeLabel} size="sm" className="teal-u-absolute teal-u-right-4 teal-u-top-4">
              <X />
            </IconButton>
          </DialogPrimitive.Close>
          <div className="teal-u-flex-1 teal-u-overflow-y-auto teal-u-px-6 teal-u-py-5">{children}</div>
          {footer ? (
            <div className="teal-u-flex teal-u-flex-col-reverse teal-u-gap-2 teal-u-border-t teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-6 sm:teal-u-flex-row sm:teal-u-justify-end">
              {footer}
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})
