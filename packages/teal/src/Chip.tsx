import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from './cn'

export interface ChipProps {
  className?: string
  /** Dims the chip and disables the remove button. */
  disabled?: boolean
  /** Content rendered inside the chip. */
  label: ReactNode
  /** When provided, renders a remove button that calls this handler. */
  onRemove?: () => void
  /** Highlights the chip with the primary tint, same as variant="primary". */
  selected?: boolean
  /** Color treatment of the chip. */
  variant?: 'neutral' | 'primary'
}

export function Chip({ className, disabled = false, label, onRemove, selected = false, variant = 'neutral' }: ChipProps) {
  const emphasized = selected || variant === 'primary'
  return (
    <span
      className={cn(
        'teal-u-inline-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-px-2.5 teal-u-py-1 teal-u-text-xs teal-u-font-semibold',
        emphasized
          ? 'teal-u-border-primary/30 teal-u-bg-primary/10 teal-u-text-primary'
          : 'teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-high teal-u-text-on-surface',
        disabled && 'teal-u-opacity-55',
        className,
      )}
    >
      {label}
      {onRemove ? (
        <button
          type="button"
          aria-label={typeof label === 'string' ? `Remove ${label}` : 'Remove'}
          disabled={disabled}
          onClick={onRemove}
          className="teal-focus-ring teal-u-inline-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-current hover:teal-u-bg-surface-container-highest disabled:teal-u-pointer-events-none"
        >
          <X aria-hidden="true" className="teal-u-size-3.5" strokeWidth={2.5} />
        </button>
      ) : null}
    </span>
  )
}
