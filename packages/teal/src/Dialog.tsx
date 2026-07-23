import { forwardRef, type ReactNode, type RefObject } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface DialogProps {
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
  /** Element that receives focus after a controlled dialog closes. */
  restoreFocusRef?: RefObject<HTMLElement | null>
  /** Width of the dialog surface. */
  size?: 'sm' | 'md' | 'lg'
  /** Title rendered at the top; also the accessible name of the dialog. */
  title: ReactNode
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    children,
    className,
    closeLabel = 'Close',
    defaultOpen,
    description,
    footer,
    onOpenChange,
    open,
    restoreFocusRef,
    size = 'md',
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
          onCloseAutoFocus={restoreFocusRef ? (event) => {
            event.preventDefault()
            restoreFocusRef.current?.focus()
          } : undefined}
          className={cn(
            'teal-dialog-content teal-overlay-surface teal-u-fixed teal-u-left-1/2 teal-u-top-1/2 teal-u-z-[var(--teal-z-dialog)] teal-u-max-h-[calc(100vh-2rem)] teal-u-w-[calc(100%-2rem)] -teal-u-translate-x-1/2 -teal-u-translate-y-1/2 teal-u-overflow-y-auto teal-u-border teal-u-bg-surface teal-u-p-6 teal-u-text-on-surface teal-u-outline-none',
            size === 'sm' && 'teal-u-max-w-sm',
            size === 'md' && 'teal-u-max-w-lg',
            size === 'lg' && 'teal-u-max-w-2xl',
            className,
          )}
        >
          <div className="teal-u-pr-10">
            <DialogPrimitive.Title className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
              {title}
            </DialogPrimitive.Title>
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
          <div className="teal-u-mt-5">{children}</div>
          {footer ? <div className="teal-u-mt-6 teal-u-flex teal-u-flex-col-reverse teal-u-gap-2 sm:teal-u-flex-row sm:teal-u-justify-end">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})
