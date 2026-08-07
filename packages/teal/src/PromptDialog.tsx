import { forwardRef, useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from './Button'
import { Input } from './Input'
import { cn } from './cn'

export interface PromptDialogProps {
  /** Text of the cancel button. */
  cancelLabel?: string
  className?: string
  /** Text of the confirm button. */
  confirmLabel?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Initial input value; restored each time the dialog opens. */
  defaultValue?: string
  /** Supporting text rendered under the title. */
  description?: ReactNode
  /** Label of the input. */
  label: string
  /** Called when the cancel button is pressed. */
  onCancel?: () => void
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Called with the entered value when the dialog is confirmed. */
  onSubmit?: (value: string) => void
  /** Controlled open state. */
  open?: boolean
  /** Placeholder of the input. */
  placeholder?: string
  /** Title rendered at the top; also the accessible name of the dialog. */
  title: ReactNode
}

export const PromptDialog = forwardRef<HTMLDivElement, PromptDialogProps>(function PromptDialog(
  {
    cancelLabel = 'Cancel',
    className,
    confirmLabel = 'Confirm',
    defaultOpen,
    defaultValue = '',
    description,
    label,
    onCancel,
    onOpenChange,
    onSubmit,
    open,
    placeholder,
    title,
  },
  ref,
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false)
  const isOpen = open !== undefined ? open : internalOpen
  const [value, setValue] = useState(defaultValue)
  const inputId = useId()

  useEffect(() => {
    if (isOpen) setValue(defaultValue)
  }, [isOpen, defaultValue])

  function setOpen(next: boolean) {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.(value)
    setOpen(false)
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
          className={cn(
            'teal-dialog-content teal-overlay-surface teal-u-fixed teal-u-left-1/2 teal-u-top-1/2 teal-u-z-[var(--teal-z-dialog)] teal-u-max-h-[calc(100vh-2rem)] teal-u-w-[calc(100%-2rem)] teal-u-max-w-md -teal-u-translate-x-1/2 -teal-u-translate-y-1/2 teal-u-overflow-y-auto teal-u-border teal-u-bg-surface teal-u-p-6 teal-u-text-on-surface teal-u-outline-none',
            className,
          )}
        >
          <DialogPrimitive.Title className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
            {title}
          </DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="teal-u-mt-2 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
              {description}
            </DialogPrimitive.Description>
          ) : null}
          <form onSubmit={handleSubmit} className="teal-u-mt-5">
            <label htmlFor={inputId} className="teal-u-mb-2 teal-u-block teal-u-text-sm teal-u-font-bold teal-u-text-on-surface">
              {label}
            </label>
            <Input
              id={inputId}
              autoFocus
              value={value}
              placeholder={placeholder}
              onChange={(event) => setValue(event.target.value)}
            />
            <div className="teal-u-mt-6 teal-u-flex teal-u-flex-col-reverse teal-u-gap-2 sm:teal-u-flex-row sm:teal-u-justify-end">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                {cancelLabel}
              </Button>
              <Button type="submit">{confirmLabel}</Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})
