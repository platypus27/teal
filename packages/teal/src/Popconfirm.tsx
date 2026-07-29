import { useState, type ReactElement, type ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { Button } from './Button'
import { cn } from './cn'
import { Popover } from './Popover'

export interface PopconfirmProps {
  /** Label of the cancel button. */
  cancelText?: string
  className?: string
  /** Label of the confirm button. */
  confirmText?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Supporting text rendered under the title. */
  message?: ReactNode
  /** Called when the cancel button is pressed. */
  onCancel?: () => void
  /** Called when the confirm button is pressed. */
  onConfirm?: () => void
  /** Called when the popconfirm opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Short question rendered next to the icon; also the accessible name of the popover. */
  title: string
  /** 'danger' styles the confirm button and icon as destructive. */
  tone?: 'default' | 'danger'
  /** Element that toggles the popconfirm; receives trigger props automatically. */
  trigger: ReactElement
}

export function Popconfirm({
  cancelText = 'Cancel',
  className,
  confirmText = 'Confirm',
  defaultOpen = false,
  message,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  title,
  tone = 'default',
  trigger,
}: PopconfirmProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open !== undefined ? open : internalOpen

  function setOpen(nextOpen: boolean) {
    if (open === undefined) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  function handleConfirm() {
    onConfirm?.()
    setOpen(false)
  }

  function handleCancel() {
    onCancel?.()
    setOpen(false)
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={setOpen}
      label={title}
      trigger={trigger}
      className={cn('teal-u-w-72', className)}
    >
      <div className="teal-u-flex teal-u-gap-2.5">
        <CircleAlert
          aria-hidden="true"
          className={cn(
            'teal-u-mt-0.5 teal-u-size-[var(--teal-icon-md)] teal-u-shrink-0',
            tone === 'danger' ? 'teal-u-text-error' : 'teal-u-text-warning',
          )}
        />
        <div className="teal-u-min-w-0 teal-u-flex-1">
          <p className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{title}</p>
          {message ? <p className="teal-u-mt-1 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">{message}</p> : null}
        </div>
      </div>
      <div className="teal-u-mt-4 teal-u-flex teal-u-justify-end teal-u-gap-2">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button variant={tone === 'danger' ? 'danger' : 'primary'} size="sm" onClick={handleConfirm}>
          {confirmText}
        </Button>
      </div>
    </Popover>
  )
}
