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
        data-size={size}
        aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
        aria-invalid={invalid ?? (semantics.invalid || undefined)}
        required={semantics.required}
        className={cn(
          'teal-focus-ring teal-switch-root teal-u-box-border teal-u-relative teal-u-flex teal-u-items-center teal-u-shrink-0 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-outline teal-u-bg-surface-container-highest hover:enabled:teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-on-surface)_8%,var(--teal-color-surface-container-highest))] disabled:teal-u-cursor-not-allowed disabled:teal-u-opacity-50 data-[state=checked]:teal-u-border-primary data-[state=checked]:teal-u-bg-primary hover:enabled:data-[state=checked]:teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-on-primary)_8%,var(--teal-color-primary))]',
          size === 'sm' ? 'teal-u-h-5 teal-u-w-9' : 'teal-u-h-6 teal-u-w-11',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'teal-switch-thumb teal-u-block teal-u-size-4 teal-u-rounded-full teal-u-bg-outline teal-u-shadow-sm motion-reduce:teal-u-transition-none data-[state=checked]:teal-u-bg-on-primary',
            size === 'md' ? 'data-[state=checked]:teal-u-size-5' : undefined,
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  )
})
