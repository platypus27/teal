import { forwardRef, type ReactElement, type ReactNode } from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { Button } from './Button'
import { cn } from './cn'

export interface AlertDialogProps {
  /** Custom action area rendered at the bottom; overrides the default cancel/confirm buttons. */
  actions?: ReactNode
  /** Label of the cancel button. */
  cancelText?: string
  className?: string
  /** Label of the confirm button. */
  confirmText?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Supporting text rendered under the title; also the accessible description of the dialog. */
  description?: ReactNode
  /** Called when the cancel button is pressed. */
  onCancel?: () => void
  /** Called when the confirm button is pressed. */
  onConfirm?: () => void
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** 'danger' styles the confirm button as destructive. */
  tone?: 'default' | 'danger'
  /** Title rendered at the top; also the accessible name of the dialog. */
  title: ReactNode
  /** Element that opens the dialog; receives trigger props automatically. */
  trigger: ReactElement
}

export const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(function AlertDialog(
  {
    actions,
    cancelText = 'Cancel',
    className,
    confirmText = 'Confirm',
    defaultOpen,
    description,
    onCancel,
    onConfirm,
    onOpenChange,
    open,
    tone = 'default',
    title,
    trigger,
  },
  ref,
) {
  return (
    <AlertDialogPrimitive.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/50 teal-u-backdrop-blur-sm" />
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            'teal-dialog-content teal-overlay-surface teal-u-fixed teal-u-left-1/2 teal-u-top-1/2 teal-u-z-[var(--teal-z-dialog)] teal-u-max-h-[calc(100vh-2rem)] teal-u-w-[calc(100%-2rem)] teal-u-max-w-md -teal-u-translate-x-1/2 -teal-u-translate-y-1/2 teal-u-overflow-y-auto teal-u-border teal-u-bg-surface teal-u-p-6 teal-u-text-on-surface teal-u-outline-none',
            className,
          )}
        >
          <AlertDialogPrimitive.Title className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
            {title}
          </AlertDialogPrimitive.Title>
          {description ? (
            <AlertDialogPrimitive.Description className="teal-u-mt-2 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
              {description}
            </AlertDialogPrimitive.Description>
          ) : null}
          <div className="teal-u-mt-6 teal-u-flex teal-u-flex-col-reverse teal-u-gap-2 sm:teal-u-flex-row sm:teal-u-justify-end">
            {actions ?? (
              <>
                <AlertDialogPrimitive.Cancel asChild>
                  <Button variant="secondary" onClick={onCancel}>
                    {cancelText}
                  </Button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Action asChild>
                  <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
                    {confirmText}
                  </Button>
                </AlertDialogPrimitive.Action>
              </>
            )}
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
})
