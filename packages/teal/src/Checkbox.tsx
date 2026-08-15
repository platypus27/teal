import { forwardRef, useState, type ReactNode } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'children'> {
  /** Supporting text rendered below the label. */
  description?: ReactNode
  /** Optional icon rendered above the label in the card variant. */
  icon?: ReactNode
  /** Visible label rendered next to the checkbox. Required outside a Field; inside a Field the Field's label is used. In the card variant it doubles as the card title and accessible name. */
  label?: ReactNode
  /** Visual presentation: a plain checkbox control or a selectable card. */
  variant?: 'checkbox' | 'card'
  /** Hides the label visually while keeping it available to screen readers. */
  visuallyHiddenLabel?: boolean
}

export const Checkbox = forwardRef<React.ComponentRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox({
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    className,
    description,
    icon,
    id,
    label,
    required,
    variant = 'checkbox',
    visuallyHiddenLabel = false,
    ...props
  }, ref) {
    const semantics = useFormSemantics({
      description,
      id,
      invalid: isAriaTrue(invalid),
      prefix: 'teal-checkbox',
      required,
    })

    // Hoisted so the card variant's uncontrolled state keeps the hook order stable.
    const [internalChecked, setInternalChecked] = useState(() => props.defaultChecked === true)

    if (variant === 'card') {
      const { checked, defaultChecked: _defaultChecked, disabled, onCheckedChange, ...cardProps } = props
      // The card is a boolean toggle; a controlled 'indeterminate' reads as unchecked.
      const isChecked = checked === undefined ? internalChecked : checked === true

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
          aria-describedby={describedBy}
          aria-invalid={invalid}
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
          {...cardProps}
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
            <span className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{label}</span>
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
    }

    const showLabel = hasFormContent(label) && !semantics.labeledByField
    const showDescription = hasFormContent(description)

    return (
      <div className="teal-u-flex teal-u-items-start teal-u-gap-2.5">
        <CheckboxPrimitive.Root
          ref={ref}
          id={semantics.controlId}
          aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          required={semantics.required}
          className={cn(
            'teal-focus-ring teal-u-box-border teal-u-group teal-u-mt-0.5 teal-u-flex teal-u-size-5 teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-text-on-primary hover:teal-u-border-primary disabled:teal-u-cursor-not-allowed disabled:teal-u-bg-surface-container-high disabled:teal-u-opacity-50 data-[state=checked]:teal-u-border-primary data-[state=checked]:teal-u-bg-primary data-[state=indeterminate]:teal-u-border-primary data-[state=indeterminate]:teal-u-bg-primary',
            className,
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="teal-check-indicator">
            <Minus
              aria-hidden="true"
              className="teal-u-hidden teal-u-size-[var(--teal-icon-xs)] group-data-[state=indeterminate]:teal-u-block"
              strokeWidth={3}
            />
            <Check
              aria-hidden="true"
              className="teal-u-size-[var(--teal-icon-xs)] group-data-[state=indeterminate]:teal-u-hidden"
              strokeWidth={3}
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {showLabel || showDescription ? (
          <div className="teal-u-grid teal-u-gap-0.5">
            {showLabel ? (
              <label
                htmlFor={semantics.controlId}
                className={cn('teal-u-cursor-pointer teal-u-text-sm teal-u-font-medium teal-u-text-on-surface', visuallyHiddenLabel && 'teal-u-sr-only')}
              >
                {label}
              </label>
            ) : null}
            {showDescription ? (
              <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
)
