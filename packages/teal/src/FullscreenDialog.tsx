import { forwardRef, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface FullscreenDialogProps {
  /** Body content of the dialog. */
  children: ReactNode
  className?: string
  /** Accessible label for the close button. */
  closeLabel?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Supporting text rendered under the title. */
  description?: ReactNode
  /** Action area rendered at the bottom of the dialog. */
  footer?: ReactNode
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Title rendered in the header; also the accessible name of the dialog. */
  title: ReactNode
}

export const FullscreenDialog = forwardRef<HTMLDivElement, FullscreenDialogProps>(function FullscreenDialog(
  {
    children,
    className,
    closeLabel = 'Close',
    defaultOpen,
    description,
    footer,
    onOpenChange,
    open,
    title,
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
          className={cn(
            'teal-dialog-content teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-h-dvh teal-u-w-full teal-u-flex-col teal-u-bg-surface teal-u-text-on-surface teal-u-outline-none',
            className,
          )}
        >
          <div className="teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-between teal-u-gap-4 teal-u-border-b teal-u-border-[color:var(--teal-border-subtle)] teal-u-py-4 teal-u-pl-6 teal-u-pr-4">
            <div>
              <DialogPrimitive.Title className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="teal-u-mt-1 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close asChild>
              <IconButton label={closeLabel}>
                <X />
              </IconButton>
            </DialogPrimitive.Close>
          </div>
          <div className="teal-u-flex-1 teal-u-overflow-y-auto teal-u-p-6">{children}</div>
          {footer ? (
            <div className="teal-u-flex teal-u-shrink-0 teal-u-flex-col-reverse teal-u-gap-2 teal-u-border-t teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-6 sm:teal-u-flex-row sm:teal-u-justify-end">
              {footer}
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})
