import { forwardRef, type ReactNode } from 'react'
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
        <DialogPrimitive.Overlay className="teal-dialog-overlay fixed inset-0 z-[var(--teal-z-overlay)] bg-black/50 backdrop-blur-sm" />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'teal-dialog-content fixed left-1/2 top-1/2 z-[var(--teal-z-dialog)] max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-outline-variant/40 bg-surface-container p-6 text-on-surface shadow-[var(--teal-shadow-overlay)] outline-none',
            size === 'sm' && 'max-w-sm',
            size === 'md' && 'max-w-lg',
            size === 'lg' && 'max-w-2xl',
            className,
          )}
        >
          <div className="pr-10">
            <DialogPrimitive.Title className="font-headline text-lg font-bold text-on-surface">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          <DialogPrimitive.Close asChild>
            <IconButton label={closeLabel} size="sm" className="absolute right-4 top-4">
              <X />
            </IconButton>
          </DialogPrimitive.Close>
          <div className="mt-5">{children}</div>
          {footer ? <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})
