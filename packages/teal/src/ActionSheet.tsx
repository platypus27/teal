import { forwardRef, useState, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from './cn'

export interface ActionSheetAction {
  /** Renders the action in the destructive (error) color. */
  destructive?: boolean
  /** Disables the action. */
  disabled?: boolean
  /** Text of the action. */
  label: string
  /** Called when the action is chosen, before the sheet closes. */
  onSelect?: () => void
}

export interface ActionSheetProps {
  /** Actions listed in the sheet, in order. */
  actions: ActionSheetAction[]
  /** Text of the cancel button. */
  cancelLabel?: string
  className?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Supporting text rendered under the title. */
  description?: ReactNode
  /** Accessible name used when no visible title is provided. */
  label?: string
  /** Called when the cancel button is pressed. */
  onCancel?: () => void
  /** Called when the sheet opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Title rendered above the actions; also the accessible name of the sheet. */
  title?: ReactNode
}

export const ActionSheet = forwardRef<HTMLDivElement, ActionSheetProps>(function ActionSheet(
  {
    actions,
    cancelLabel = 'Cancel',
    className,
    defaultOpen,
    description,
    label = 'Actions',
    onCancel,
    onOpenChange,
    open,
    title,
  },
  ref,
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false)
  const isOpen = open !== undefined ? open : internalOpen

  function setOpen(next: boolean) {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function handleCancel() {
    onCancel?.()
    setOpen(false)
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/50 teal-u-backdrop-blur-sm" />
        <DialogPrimitive.Content
          ref={ref}
          aria-label={title ? undefined : label}
          className={cn(
            'teal-bottom-sheet-content teal-u-fixed teal-u-bottom-0 teal-u-left-1/2 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-w-full teal-u-max-w-xl -teal-u-translate-x-1/2 teal-u-flex-col teal-u-gap-2 teal-u-p-3 teal-u-text-on-surface teal-u-outline-none',
            className,
          )}
        >
          <div className="teal-u-overflow-hidden teal-u-rounded-2xl teal-u-border teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-shadow-overlay">
            {title || description ? (
              <div className="teal-u-border-b teal-u-border-[color:var(--teal-border-subtle)] teal-u-px-4 teal-u-py-3 teal-u-text-center">
                {title ? (
                  <DialogPrimitive.Title className="teal-u-text-sm teal-u-font-bold teal-u-text-on-surface">
                    {title}
                  </DialogPrimitive.Title>
                ) : null}
                {description ? (
                  <DialogPrimitive.Description className="teal-u-mt-1 teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
                    {description}
                  </DialogPrimitive.Description>
                ) : null}
              </div>
            ) : null}
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                disabled={action.disabled}
                data-destructive={action.destructive || undefined}
                onClick={() => {
                  action.onSelect?.()
                  setOpen(false)
                }}
                className={cn(
                  'teal-focus-ring teal-u-flex teal-u-w-full teal-u-items-center teal-u-justify-center teal-u-px-4 teal-u-py-3 teal-u-text-sm teal-u-font-medium hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-55',
                  index > 0 || title || description
                    ? 'teal-u-border-t teal-u-border-[color:var(--teal-border-subtle)]'
                    : undefined,
                  action.destructive ? 'teal-u-text-error' : 'teal-u-text-primary',
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="teal-focus-ring teal-u-w-full teal-u-rounded-2xl teal-u-border teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-px-4 teal-u-py-3 teal-u-text-sm teal-u-font-bold teal-u-text-on-surface teal-u-shadow-overlay hover:teal-u-bg-surface-container-high"
          >
            {cancelLabel}
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})
