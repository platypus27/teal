import { forwardRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { cn } from './cn'
import { FieldScaffolding } from './field-scaffolding'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { fieldVariants } from './Input'
import { InputAddon, InputGroup } from './InputGroup'

/** Narrow-symbol formatter; falls back to plain decimal grouping for unknown codes. */
function createNumberFormatter(currency: string, locale: string) {
  try {
    const fractionDigits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })
  } catch {
    return new Intl.NumberFormat(locale)
  }
}

function getCurrencySymbol(currency: string, locale: string) {
  try {
    const parts = new Intl.NumberFormat(locale, { style: 'currency', currency }).formatToParts(0)
    return parts.find((part) => part.type === 'currency')?.value ?? currency
  } catch {
    return currency
  }
}

/** Keeps digits, one decimal separator, and a leading minus; returns undefined for empty input. */
function parseAmount(text: string) {
  const cleaned = text.replace(/[^\d.,-]/g, '').replace(/,/g, '')
  if (cleaned === '' || cleaned === '-') return undefined
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : undefined
}

export interface CurrencyInputProps {
  /** Extra description ids, merged with the component's own description. */
  'aria-describedby'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  className?: string
  /** ISO 4217 currency code used for the leading symbol and fraction digits. */
  currency?: string
  /** Initial amount when uncontrolled. */
  defaultValue?: number
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** BCP 47 locale used for grouping and decimal separators. */
  locale?: string
  /** Largest allowed amount; the field clamps to it on blur. */
  max?: number
  /** Smallest allowed amount; the field clamps to it on blur. */
  min?: number
  /** Called with the parsed amount, or undefined when the field is emptied. */
  onChange?: (value: number | undefined) => void
  /** Text shown when the field is empty. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled amount. */
  value?: number
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    'aria-label': ariaLabel,
    className,
    currency = 'USD',
    defaultValue,
    description,
    disabled,
    id,
    label,
    locale = 'en-US',
    max,
    min,
    onChange,
    placeholder,
    required,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-currency-input',
    required,
  })

  const [internalAmount, setInternalAmount] = useState<number | undefined>(defaultValue)
  const [draft, setDraft] = useState<string | null>(null)
  const amount = value !== undefined ? value : internalAmount
  const formatter = createNumberFormatter(currency, locale)
  const text = draft ?? (amount === undefined ? '' : formatter.format(amount))

  function commit(next: number | undefined) {
    if (value === undefined) setInternalAmount(next)
    onChange?.(next)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    setDraft(raw)
    commit(raw.trim() === '' ? undefined : parseAmount(raw))
  }

  function handleBlur() {
    setDraft(null)
    if (amount !== undefined) {
      let clamped = amount
      if (min !== undefined && clamped < min) clamped = min
      if (max !== undefined && clamped > max) clamped = max
      if (clamped !== amount) commit(clamped)
    }
  }

  return (
    <FieldScaffolding
      className={className}
      controlId={semantics.controlId}
      description={description}
      descriptionId={semantics.descriptionId}
      label={label}
      labeledByField={semantics.labeledByField}
    >
      <InputGroup>
        <InputAddon position="leading" aria-hidden="true">
          {getCurrencySymbol(currency, locale)}
        </InputAddon>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          id={semantics.controlId}
          aria-label={ariaLabel}
          aria-describedby={mergeDescriptionIds(
            describedBy,
            hasFormContent(description) ? semantics.descriptionId : undefined,
          )}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          required={required ?? semantics.required}
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(fieldVariants(), 'teal-u-tabular-nums')}
        />
      </InputGroup>
    </FieldScaffolding>
  )
})
