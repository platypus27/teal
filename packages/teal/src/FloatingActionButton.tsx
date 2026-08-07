import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { cn } from './cn'
import { Tooltip } from './Tooltip'

const positionClasses = {
  'bottom-right': 'teal-u-bottom-6 teal-u-right-6',
  'bottom-left': 'teal-u-bottom-6 teal-u-left-6',
  'top-right': 'teal-u-top-6 teal-u-right-6',
  'top-left': 'teal-u-top-6 teal-u-left-6',
}

const tooltipSides = {
  'bottom-right': 'left',
  'bottom-left': 'right',
  'top-right': 'left',
  'top-left': 'right',
} as const

export interface FloatingActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Text rendered next to the icon; turns the round FAB into an extended pill. */
  extendedLabel?: string
  /** Icon rendered inside the button. Defaults to a plus icon. */
  icon?: ReactNode
  /** Accessible name for the button; also the default tooltip text. */
  label: string
  /** Viewport corner the button is fixed to. */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Tooltip text shown on hover and focus; pass the label or a longer hint. */
  tooltip?: string
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  function FloatingActionButton(
    { className, extendedLabel, icon, label, position = 'bottom-right', tooltip, type = 'button', ...props },
    ref,
  ) {
    const button = (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cn(
          'teal-focus-ring teal-u-fixed teal-u-z-[var(--teal-z-fab,var(--teal-z-overlay))] teal-u-inline-flex teal-u-items-center teal-u-justify-center teal-u-gap-2 teal-u-bg-primary teal-u-text-on-primary teal-u-shadow-overlay teal-u-transition-shadow hover:teal-u-bg-primary/90 active:teal-u-scale-95 motion-reduce:teal-u-transform-none motion-reduce:teal-u-transition-none',
          extendedLabel ? 'teal-u-h-14 teal-u-rounded-2xl teal-u-px-5 teal-u-text-sm teal-u-font-bold' : 'teal-u-size-14 teal-u-rounded-full',
          positionClasses[position],
          className,
        )}
        {...props}
      >
        {icon ?? <Plus aria-hidden="true" className="teal-u-size-[var(--teal-icon-lg)]" />}
        {extendedLabel ? <span>{extendedLabel}</span> : null}
      </button>
    )

    const tooltipText = tooltip ?? (extendedLabel ? undefined : label)
    if (!tooltipText) return button
    return (
      <Tooltip content={tooltipText} side={tooltipSides[position]}>
        {button}
      </Tooltip>
    )
  },
)
