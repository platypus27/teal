import { forwardRef, type ReactNode } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface RadioGroupOption {
  /** Value submitted for this option. */
  value: string
  /** Visible label rendered next to the radio. */
  label: ReactNode
  /** Supporting text rendered below the option label. */
  description?: ReactNode
  /** Disables just this option. */
  disabled?: boolean
}

export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'children'> {
  /** Supporting text rendered below the group and linked to it for assistive technology. */
  description?: ReactNode
  /** Visible label for the whole group. */
  label?: ReactNode
  /** Options rendered as radios inside the group. */
  options: RadioGroupOption[]
  /** Layout direction of the options. */
  orientation?: 'vertical' | 'horizontal'
}

export const RadioGroup = forwardRef<React.ComponentRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  function RadioGroup(
    {
      'aria-describedby': describedBy,
      'aria-invalid': invalid,
      'aria-labelledby': labelledBy,
      className,
      description,
      id,
      label,
      options,
      orientation = 'vertical',
      required,
      ...props
    },
    ref,
  ) {
    const semantics = useFormSemantics({
      description,
      id,
      invalid: isAriaTrue(invalid),
      prefix: 'teal-radio-group',
      required,
    })
    const showLabel = hasFormContent(label) && !semantics.labeledByField
    const showDescription = hasFormContent(description)
    const labelId = `${semantics.controlId}-label`

    return (
      <div className="teal-u-grid teal-u-gap-2">
        {showLabel ? (
          <span id={labelId} className="teal-u-text-sm teal-u-font-medium teal-u-text-on-surface">
            {label}
          </span>
        ) : null}
        <RadioGroupPrimitive.Root
          ref={ref}
          id={semantics.controlId}
          aria-labelledby={labelledBy ?? (showLabel ? labelId : undefined)}
          aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          aria-required={semantics.required || undefined}
          required={semantics.required}
          className={cn(
            orientation === 'horizontal'
              ? 'teal-u-flex teal-u-flex-wrap teal-u-gap-x-6 teal-u-gap-y-3'
              : 'teal-u-grid teal-u-gap-3',
            className,
          )}
          {...props}
        >
          {options.map((option) => {
            const itemId = `${semantics.controlId}-${option.value}`
            return (
              <div key={option.value} className="teal-u-flex teal-u-items-start teal-u-gap-2.5">
                <RadioGroupPrimitive.Item
                  id={itemId}
                  value={option.value}
                  disabled={option.disabled}
                  className="teal-focus-ring teal-u-box-border teal-u-mt-0.5 teal-u-flex teal-u-size-5 teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface hover:teal-u-border-primary disabled:teal-u-cursor-not-allowed disabled:teal-u-opacity-50 data-[state=checked]:teal-u-border-primary"
                >
                  <RadioGroupPrimitive.Indicator className="teal-check-indicator teal-u-flex teal-u-items-center teal-u-justify-center">
                    <span className="teal-u-size-2.5 teal-u-rounded-full teal-u-bg-primary" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>
                <div className="teal-u-grid teal-u-gap-0.5">
                  <label
                    htmlFor={itemId}
                    className={cn(
                      'teal-u-text-sm teal-u-font-medium teal-u-text-on-surface',
                      option.disabled ? 'teal-u-cursor-not-allowed teal-u-opacity-50' : 'teal-u-cursor-pointer',
                    )}
                  >
                    {option.label}
                  </label>
                  {hasFormContent(option.description) ? (
                    <p className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
                      {option.description}
                    </p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </RadioGroupPrimitive.Root>
        {showDescription ? (
          <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
    )
  },
)
