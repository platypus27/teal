import { forwardRef, type ReactNode } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'children'> {
  /** Supporting text rendered below the label. */
  description?: ReactNode
  /** Visible label describing the setting the switch controls. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Track and thumb size. */
  size?: 'sm' | 'md'
}

export const Switch = forwardRef<React.ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(function Switch(
  { 'aria-describedby': describedBy, 'aria-invalid': invalid, className, description, id, label, required, size = 'md', ...props },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-switch',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)

  return (
    <div className="teal-u-flex teal-u-items-start teal-u-justify-between teal-u-gap-4">
      {showLabel || showDescription ? (
        <div className="teal-u-grid teal-u-gap-0.5">
          {showLabel ? (
            <label htmlFor={semantics.controlId} className="teal-u-cursor-pointer teal-u-text-sm teal-u-font-medium teal-u-text-on-surface">
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
      <SwitchPrimitive.Root
        ref={ref}
        id={semantics.controlId}
        aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
        aria-invalid={invalid ?? (semantics.invalid || undefined)}
        required={semantics.required}
        className={cn(
          'teal-focus-ring teal-u-box-border teal-u-relative teal-u-shrink-0 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-strong)] teal-u-bg-surface hover:teal-u-border-outline disabled:teal-u-cursor-not-allowed disabled:teal-u-bg-surface-container-high disabled:teal-u-opacity-50 data-[state=checked]:teal-u-border-primary data-[state=checked]:teal-u-bg-primary',
          size === 'sm' ? 'teal-u-h-5 teal-u-w-9' : 'teal-u-h-6 teal-u-w-11',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'teal-u-block teal-u-rounded-full teal-u-bg-white teal-u-shadow-sm teal-u-transition-transform teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
            size === 'sm'
              ? 'teal-u-size-4 teal-u-translate-x-0.5 data-[state=checked]:teal-u-translate-x-[18px]'
              : 'teal-u-size-5 teal-u-translate-x-0.5 data-[state=checked]:teal-u-translate-x-[22px]',
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  )
})
