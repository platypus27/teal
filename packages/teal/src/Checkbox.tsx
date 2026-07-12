import { forwardRef, type ReactNode } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'children'> {
  /** Supporting text rendered below the label. */
  description?: ReactNode
  /** Visible label rendered next to the checkbox. */
  label: ReactNode
  /** Hides the label visually while keeping it available to screen readers. */
  visuallyHiddenLabel?: boolean
}

export const Checkbox = forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
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

    return (
      <div className="flex items-start gap-2.5">
        <CheckboxPrimitive.Root
          ref={ref}
          id={semantics.controlId}
          aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          required={semantics.required}
          className={cn(
            'group mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-outline-variant bg-surface-container-highest text-on-primary outline-none transition-colors hover:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
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
        <div className="grid gap-0.5">
          <label
            htmlFor={semantics.controlId}
            className={cn('cursor-pointer text-sm font-medium text-on-surface', visuallyHiddenLabel && 'sr-only')}
          >
            {label}
          </label>
          {hasFormContent(description) ? (
            <p id={semantics.descriptionId} className="text-xs leading-relaxed text-on-surface-variant">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    )
  },
)
