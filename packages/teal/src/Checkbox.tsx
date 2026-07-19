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
      <div className="flex items-start gap-2.5">
        <CheckboxPrimitive.Root
          ref={ref}
          id={semantics.controlId}
          aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          required={semantics.required}
          className={cn(
            'teal-focus-ring group mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-[color:var(--teal-border-strong)] bg-surface text-on-primary hover:border-primary disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
            className,
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator>
            <Minus
              aria-hidden="true"
              className="hidden size-3.5 group-data-[state=indeterminate]:block"
              strokeWidth={3}
            />
            <Check
              aria-hidden="true"
              className="size-3.5 group-data-[state=indeterminate]:hidden"
              strokeWidth={3}
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {showLabel || showDescription ? (
          <div className="grid gap-0.5">
            {showLabel ? (
              <label
                htmlFor={semantics.controlId}
                className={cn('cursor-pointer text-sm font-medium text-on-surface', visuallyHiddenLabel && 'sr-only')}
              >
                {label}
              </label>
            ) : null}
            {showDescription ? (
              <p id={semantics.descriptionId} className="text-xs leading-relaxed text-on-surface-variant">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
)
