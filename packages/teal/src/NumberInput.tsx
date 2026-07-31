import { forwardRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { fieldVariants } from './Input'

export interface NumberInputProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  className?: string
  /** Initial value when uncontrolled. */
  defaultValue?: number
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Largest allowed value; stepper clamps to it. */
  max?: number
  /** Smallest allowed value; stepper clamps to it. */
  min?: number
  /** Called with the parsed number, or undefined when the field is emptied. */
  onValueChange?: (value: number | undefined) => void
  /** Text shown when the field is empty. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Amount added or removed by the stepper buttons. */
  step?: number
  /** Controlled value. */
  value?: number
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled,
    id,
    label,
    max,
    min,
    onValueChange,
    placeholder,
    required,
    step = 1,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-number-input',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)

  const [internalNumber, setInternalNumber] = useState<number | undefined>(defaultValue)
  const [draft, setDraft] = useState<string | null>(null)
  const number = value !== undefined ? value : internalNumber
  const text = draft ?? (number === undefined ? '' : String(number))

  function clamp(next: number) {
    if (min !== undefined && next < min) return min
    if (max !== undefined && next > max) return max
    return next
  }

  function commit(next: number | undefined) {
    if (value === undefined) setInternalNumber(next)
    onValueChange?.(next)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    setDraft(raw)
    if (raw.trim() === '') {
      commit(undefined)
      return
    }
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) commit(parsed)
  }

  function stepBy(direction: 1 | -1) {
    const base = number ?? min ?? 0
    setDraft(null)
    commit(clamp(Number((base + direction * step).toPrecision(12))))
  }

  function handleBlur() {
    setDraft(null)
    if (number !== undefined) {
      const clamped = clamp(number)
      if (clamped !== number) commit(clamped)
    }
  }

  const atMax = number !== undefined && max !== undefined && number >= max
  const atMin = number !== undefined && min !== undefined && number <= min

  const stepperClasses =
    'teal-focus-ring teal-u-inline-flex teal-u-size-6 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40 [&_svg]:teal-u-size-3'

  return (
    <div className={cn('teal-u-grid teal-u-gap-1.5', className)}>
      {showLabel ? (
        <label htmlFor={semantics.controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      <div className="teal-u-relative">
        <input
          ref={ref}
          type="number"
          id={semantics.controlId}
          aria-label={ariaLabel}
          aria-describedby={mergeDescriptionIds(describedBy, showDescription ? semantics.descriptionId : undefined)}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          required={required ?? semantics.required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            fieldVariants(),
            'teal-u-pr-9 [appearance:textfield] [&::-webkit-inner-spin-button]:teal-u-appearance-none [&::-webkit-outer-spin-button]:teal-u-appearance-none',
          )}
        />
        <div className="teal-u-absolute teal-u-right-2.5 teal-u-top-1/2 teal-u-flex teal-u--translate-y-1/2 teal-u-flex-col">
          <button
            type="button"
            aria-label="Increment"
            disabled={disabled || atMax}
            onClick={() => stepBy(1)}
            className={stepperClasses}
          >
            <ChevronUp aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Decrement"
            disabled={disabled || atMin}
            onClick={() => stepBy(-1)}
            className={stepperClasses}
          >
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
      </div>
      {showDescription ? (
        <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  )
})
