import { forwardRef, type ReactNode } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'children'> {
  /** Supporting text rendered below the label. */
  description?: ReactNode
  /** Visible label rendered next to the checkbox. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Hides the label visually while keeping it available to screen readers. */
  visuallyHiddenLabel?: boolean
}

export const Checkbox = forwardRef<React.ComponentRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox({
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    className,
    description,
    id,
    label,
    required,
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
            'teal-focus-ring teal-u-box-border teal-u-group teal-u-mt-0.5 teal-u-flex teal-u-size-5 teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-strong)] teal-u-bg-surface teal-u-text-on-primary hover:teal-u-border-primary disabled:teal-u-cursor-not-allowed disabled:teal-u-bg-surface-container-high disabled:teal-u-opacity-50 data-[state=checked]:teal-u-border-primary data-[state=checked]:teal-u-bg-primary data-[state=indeterminate]:teal-u-border-primary data-[state=indeterminate]:teal-u-bg-primary',
            className,
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator>
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
