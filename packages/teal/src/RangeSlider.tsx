import { forwardRef, useState, type ReactNode } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export type RangeSliderValue = [number, number]

export interface RangeSliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    'children' | 'value' | 'defaultValue' | 'onValueChange' | 'onChange'
  > {
  /** Initial low/high pair when uncontrolled. */
  defaultValue?: RangeSliderValue
  /** Supporting text rendered below the slider and linked to it for assistive technology. */
  description?: ReactNode
  /** Visible label rendered above the slider. */
  label?: ReactNode
  /** Called with the new low/high pair when either thumb moves. */
  onChange?: (value: RangeSliderValue) => void
  /** Renders the current range right-aligned above the track. */
  showValue?: boolean
  /** Accessible names for the low and high thumbs. */
  thumbLabels?: [string, string]
  /** Controlled low/high pair. */
  value?: RangeSliderValue
}

export const RangeSlider = forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  function RangeSlider(
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
      minStepsBetweenThumbs = 1,
      onChange,
      showValue = false,
      step = 1,
      thumbLabels = ['Minimum value', 'Maximum value'],
      value,
      ...props
    },
    ref,
  ) {
    const semantics = useFormSemantics({
      description,
      id,
      invalid: isAriaTrue(invalid),
      prefix: 'teal-range-slider',
    })
    const showLabel = hasFormContent(label) && !semantics.labeledByField
    const showDescription = hasFormContent(description)
    const labelId = `${semantics.controlId}-label`

    const [internalValue, setInternalValue] = useState<RangeSliderValue>(defaultValue ?? [min, max])
    const currentValue = value ?? internalValue

    function handleValueChange(next: number[]) {
      const pair: RangeSliderValue = [next[0] ?? min, next[1] ?? max]
      if (value === undefined) setInternalValue(pair)
      onChange?.(pair)
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
                {currentValue[0]} – {currentValue[1]}
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
          minStepsBetweenThumbs={minStepsBetweenThumbs}
          {...(value !== undefined ? { value } : {})}
          {...(defaultValue !== undefined ? { defaultValue } : {})}
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
              aria-label={thumbLabels[index as 0 | 1] ?? `Value ${index + 1}`}
              aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
              aria-invalid={invalid ?? (semantics.invalid || undefined)}
              className="teal-focus-ring teal-u-block teal-u-size-5 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-white teal-u-shadow-sm disabled:teal-u-cursor-not-allowed"
            />
          ))}
        </SliderPrimitive.Root>
        {showDescription ? (
          <p
            id={semantics.descriptionId}
            className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant"
          >
            {description}
          </p>
        ) : null}
      </div>
    )
  },
)
