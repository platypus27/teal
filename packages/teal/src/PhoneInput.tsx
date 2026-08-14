import { forwardRef, useState, type ChangeEvent, type ReactNode } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from './cn'
import { FieldScaffolding } from './field-scaffolding'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { fieldVariants } from './Input'

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 country code. */
  code: string
  /** International dialing prefix without the plus sign. */
  dial: string
  /** Country name shown in the dropdown. */
  label: string
}

/** Curated calling-code list offered by the country dropdown. */
export const phoneCountries: PhoneCountry[] = [
  { code: 'US', dial: '1', label: 'United States' },
  { code: 'GB', dial: '44', label: 'United Kingdom' },
  { code: 'DE', dial: '49', label: 'Germany' },
  { code: 'FR', dial: '33', label: 'France' },
  { code: 'ES', dial: '34', label: 'Spain' },
  { code: 'IN', dial: '91', label: 'India' },
  { code: 'CN', dial: '86', label: 'China' },
  { code: 'JP', dial: '81', label: 'Japan' },
  { code: 'BR', dial: '55', label: 'Brazil' },
  { code: 'AU', dial: '61', label: 'Australia' },
]

/** Splits an E.164-ish string into a known dialing prefix and the national digits. */
function parsePhoneValue(value: string | undefined): { dial: string; national: string } | undefined {
  if (!value) return undefined
  const digits = value.replace(/\D/g, '')
  if (digits === '') return undefined
  const match = [...phoneCountries]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((country) => digits.startsWith(country.dial))
  if (!match) return { dial: phoneCountries[0]?.dial ?? '1', national: digits }
  return { dial: match.dial, national: digits.slice(match.dial.length) }
}

export interface PhoneInputProps {
  /** Extra description ids, merged with the component's own description. */
  'aria-describedby'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  className?: string
  /** Initial E.164-ish value when uncontrolled. */
  defaultValue?: string
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with both controls. */
  disabled?: boolean
  /** Explicit id for the number input; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Called with the E.164-ish string, or undefined when the number is emptied. */
  onChange?: (value: string | undefined) => void
  /** Text shown when the number field is empty. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled E.164-ish value, e.g. "+14155552671". */
  value?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled,
    id,
    label,
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
    prefix: 'teal-phone-input',
    required,
  })

  const [internal, setInternal] = useState(() => {
    const parsed = parsePhoneValue(defaultValue)
    return { dial: parsed?.dial ?? phoneCountries[0]?.dial ?? '1', national: parsed?.national ?? '' }
  })
  const parsed = value !== undefined ? parsePhoneValue(value) : undefined
  const dial = value !== undefined ? parsed?.dial ?? internal.dial : internal.dial
  const national = value !== undefined ? parsed?.national ?? '' : internal.national

  function commit(nextDial: string, nextNational: string) {
    if (value === undefined) setInternal({ dial: nextDial, national: nextNational })
    onChange?.(nextNational === '' ? undefined : `+${nextDial}${nextNational}`)
  }

  function handleCountryChange(nextDial: string) {
    commit(nextDial, national)
  }

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    commit(dial, event.target.value.replace(/\D/g, ''))
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
      <div className="teal-u-flex teal-u-gap-2">
        <SelectPrimitive.Root value={dial} onValueChange={handleCountryChange} {...(disabled !== undefined ? { disabled } : {})}>
          <SelectPrimitive.Trigger
            aria-label="Country calling code"
            className={cn(
              fieldVariants(),
              'teal-u-w-auto teal-u-shrink-0 teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-2',
            )}
          >
            <span className="teal-u-tabular-nums">+{dial}</span>
            <SelectPrimitive.Icon asChild>
              <ChevronDown
                aria-hidden="true"
                className="teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0 teal-u-text-on-surface-variant"
              />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={6}
              className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-max-h-[var(--radix-select-content-available-height)] teal-u-min-w-[var(--radix-select-trigger-width)] teal-u-overflow-hidden teal-u-border teal-u-bg-surface teal-u-text-on-surface"
            >
              <SelectPrimitive.Viewport className="teal-u-p-1">
                {phoneCountries.map((country) => (
                  <SelectPrimitive.Item
                    key={country.code}
                    value={country.dial}
                    textValue={`${country.label} (+${country.dial})`}
                    className="teal-focus-ring teal-u-relative teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-py-2 teal-u-pl-8 teal-u-pr-3 teal-u-text-sm data-[disabled]:teal-u-pointer-events-none data-[disabled]:teal-u-opacity-45 data-[highlighted]:teal-u-bg-primary/10 data-[highlighted]:teal-u-text-primary"
                  >
                    <span className="teal-u-absolute teal-u-left-2 teal-u-flex teal-u-size-[var(--teal-icon-sm)] teal-u-items-center teal-u-justify-center">
                      <SelectPrimitive.ItemIndicator>
                        <Check aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
                      </SelectPrimitive.ItemIndicator>
                    </span>
                    <SelectPrimitive.ItemText>
                      {country.label} (+{country.dial})
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        <input
          ref={ref}
          type="tel"
          inputMode="tel"
          id={semantics.controlId}
          aria-label={semantics.labeledByField || hasFormContent(label) ? undefined : 'Phone number'}
          aria-describedby={mergeDescriptionIds(
            describedBy,
            hasFormContent(description) ? semantics.descriptionId : undefined,
          )}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          required={required ?? semantics.required}
          disabled={disabled}
          placeholder={placeholder}
          value={national}
          onChange={handleNumberChange}
          className={cn(fieldVariants(), 'teal-u-tabular-nums')}
        />
      </div>
    </FieldScaffolding>
  )
})
