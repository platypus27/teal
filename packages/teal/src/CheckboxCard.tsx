import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from './cn'

export interface CheckboxCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'checked' | 'defaultChecked' | 'title'> {
  /** Controlled checked state. */
  checked?: boolean
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean
  /** Supporting text rendered below the title. */
  description?: ReactNode
  /** Optional icon rendered above the title. */
  icon?: ReactNode
  /** Called with the new checked state when the card is toggled. */
  onCheckedChange?: (checked: boolean) => void
  /** Card heading; doubles as the accessible name when no aria-label is given. */
  title: ReactNode
}

/**
 * A checkbox rendered as a selectable card with a title, description, and
 * optional icon. Works on its own or stacked in groups for multi-select
 * choices.
 */
export const CheckboxCard = forwardRef<HTMLButtonElement, CheckboxCardProps>(function CheckboxCard(
  { checked, className, defaultChecked = false, description, disabled, icon, onCheckedChange, title, ...props },
  ref,
) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = checked !== undefined ? checked : internalChecked

  function toggle() {
    if (checked === undefined) setInternalChecked(!isChecked)
    onCheckedChange?.(!isChecked)
  }

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'teal-focus-ring teal-u-flex teal-u-min-w-40 teal-u-items-start teal-u-justify-between teal-u-gap-3 teal-u-rounded-2xl teal-u-border teal-u-border-solid teal-u-p-4 teal-u-text-left teal-u-transition-colors',
        isChecked
          ? 'teal-u-border-primary teal-u-bg-primary/5'
          : 'teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container hover:teal-u-border-[color:var(--teal-border-strong)]',
        disabled ? 'teal-u-cursor-not-allowed teal-u-opacity-50' : 'teal-u-cursor-pointer',
        className,
      )}
      {...props}
    >
      <span className="teal-u-flex teal-u-flex-col teal-u-items-start teal-u-gap-1">
        {icon ? (
          <span
            aria-hidden="true"
            className={cn(
              'teal-u-mb-1 teal-u-inline-flex [&_svg]:teal-u-size-[var(--teal-icon-md)]',
              isChecked ? 'teal-u-text-primary' : 'teal-u-text-on-surface-variant',
            )}
          >
            {icon}
          </span>
        ) : null}
        <span className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{title}</span>
        {description ? (
          <span className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">{description}</span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'teal-u-mt-0.5 teal-u-flex teal-u-size-5 teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded teal-u-border teal-u-border-solid',
          isChecked
            ? 'teal-u-border-primary teal-u-bg-primary teal-u-text-on-primary'
            : 'teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-text-transparent',
        )}
      >
        <Check className="teal-u-size-[var(--teal-icon-xs)]" strokeWidth={3} />
      </span>
    </button>
  )
})
