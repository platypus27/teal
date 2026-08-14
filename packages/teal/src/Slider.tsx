import { forwardRef, useState, type ReactNode } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface SliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    'children' | 'value' | 'defaultValue' | 'onValueChange'
  > {
  /** Initial value when uncontrolled: a number, or a low/high pair in range mode. */
  defaultValue?: number | [number, number]
  /** Supporting text rendered below the slider and linked to it for assistive technology. */
  description?: ReactNode
  /** Visible label rendered above the slider. */
  label?: ReactNode
  /** Called with the new value (or low/high pair in range mode) when a thumb moves. */
  onValueChange?: (value: number | [number, number]) => void
  /** Renders a second thumb so the slider selects a low/high pair. */
  range?: boolean
  /** Renders the current value right-aligned above the track. */
  showValue?: boolean
  /** Accessible names for the low and high thumbs (range mode only). */
  thumbLabels?: [string, string]
  /** Controlled value: a number, or a low/high pair in range mode. */
  value?: number | [number, number]
}

export const Slider = forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(function Slider(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    id,
    label,
    max = 100,
    min = 0,
    minStepsBetweenThumbs,
    onValueChange,
    range = false,
    showValue = false,
    step = 1,
    thumbLabels = ['Minimum value', 'Maximum value'],
    value,
    ...props
  },
  ref,
) {
  const isRange = range === true
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-slider',
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const labelId = `${semantics.controlId}-label`

  const [internalValue, setInternalValue] = useState<number[]>(() =>
    defaultValue === undefined
      ? isRange
        ? [min, max]
        : [min]
      : Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue],
  )
  const currentValue: number[] = value === undefined ? internalValue : Array.isArray(value) ? value : [value]

  function handleValueChange(next: number[]) {
    if (value === undefined) setInternalValue(next)
    if (isRange) {
      onValueChange?.([next[0] ?? min, next[1] ?? max])
    } else {
      onValueChange?.(next[0] ?? min)
    }
  }

  return (
    <div className="teal-u-grid teal-u-gap-2">
      {showLabel || showValue ? (
        <div className="teal-u-flex teal-u-items-baseline teal-u-justify-between teal-u-gap-4">
          {showLabel ? (
            <span id={labelId} className="teal-u-text-sm teal-u-font-medium teal-u-text-on-surface">
              {label}
            </span>
          ) : (
            <span />
          )}
          {showValue ? (
            <span className="teal-u-text-sm teal-u-font-medium teal-u-tabular-nums teal-u-text-on-surface-variant">
              {currentValue.join(' – ')}
            </span>
          ) : null}
        </div>
      ) : null}
      <SliderPrimitive.Root
        ref={ref}
        id={semantics.controlId}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs ?? 1}
        {...(value !== undefined ? { value: currentValue } : {})}
        {...(defaultValue !== undefined && value === undefined ? { defaultValue: currentValue } : {})}
        className={cn(
          'teal-u-relative teal-u-flex teal-u-h-5 teal-u-w-full teal-u-touch-none teal-u-select-none teal-u-items-center',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="teal-u-relative teal-u-h-1.5 teal-u-grow teal-u-overflow-hidden teal-u-rounded-full teal-u-bg-surface-container-highest">
          <SliderPrimitive.Range className="teal-u-absolute teal-u-h-full teal-u-rounded-full teal-u-bg-primary" />
        </SliderPrimitive.Track>
        {currentValue.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            aria-label={isRange ? (thumbLabels[index as 0 | 1] ?? `Value ${index + 1}`) : undefined}
            aria-labelledby={!isRange && showLabel ? labelId : undefined}
            aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
            aria-invalid={invalid ?? (semantics.invalid || undefined)}
            className="teal-focus-ring teal-u-block teal-u-size-5 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-white teal-u-shadow-sm disabled:teal-u-cursor-not-allowed"
          />
        ))}
      </SliderPrimitive.Root>
      {showDescription ? (
        <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  )
})
