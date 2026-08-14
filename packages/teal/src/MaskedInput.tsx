import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { cn } from './cn'
import { FieldScaffolding } from './field-scaffolding'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { fieldVariants } from './Input'

function maskCapacity(mask: string) {
  return mask.split('').filter((char) => char === '#').length
}

function extractDigits(text: string, capacity: number) {
  return text.replace(/\D/g, '').slice(0, capacity)
}

/** Interleaves digits with the mask literals, stopping when the digits run out. */
export function applyMask(digits: string, mask: string) {
  let output = ''
  let digitIndex = 0
  for (const char of mask) {
    if (digitIndex >= digits.length) break
    output += char === '#' ? digits[digitIndex] : char
    if (char === '#') digitIndex += 1
  }
  return output
}

export interface MaskedInputProps {
  /** Extra description ids, merged with the component's own description. */
  'aria-describedby'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  className?: string
  /** Initial value when uncontrolled; digits are extracted and re-masked. */
  defaultValue?: string
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Mask pattern; `#` marks a digit slot, every other character is a literal (use non-digit literals). */
  mask: string
  /** Called with the masked string whenever the digits change. */
  onChange?: (value: string) => void
  /** Text shown when the field is empty; defaults to the mask itself. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled value; digits are extracted and re-masked. */
  value?: string
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(function MaskedInput(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    'aria-label': ariaLabel,
    className,
    defaultValue,
    description,
    disabled,
    id,
    label,
    mask,
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
    prefix: 'teal-masked-input',
    required,
  })

  const capacity = maskCapacity(mask)
  const [internalDigits, setInternalDigits] = useState(() => extractDigits(defaultValue ?? '', capacity))
  const digits = value !== undefined ? extractDigits(value, capacity) : internalDigits
  const text = applyMask(digits, mask)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const pendingCaret = useRef<number | null>(null)

  // Keep the caret after the last filled slot instead of inside a literal.
  useLayoutEffect(() => {
    if (pendingCaret.current === null) return
    const position = pendingCaret.current
    pendingCaret.current = null
    inputRef.current?.setSelectionRange(position, position)
  })

  function setRefs(node: HTMLInputElement | null) {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDigits = extractDigits(event.target.value, capacity)
    if (value === undefined) setInternalDigits(nextDigits)
    const nextText = applyMask(nextDigits, mask)
    pendingCaret.current = nextText.length
    onChange?.(nextText)
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
      <input
        ref={setRefs}
        type="text"
        inputMode="numeric"
        id={semantics.controlId}
        aria-label={ariaLabel}
        aria-describedby={mergeDescriptionIds(
          describedBy,
          hasFormContent(description) ? semantics.descriptionId : undefined,
        )}
        aria-invalid={invalid ?? (semantics.invalid || undefined)}
        required={required ?? semantics.required}
        disabled={disabled}
        placeholder={placeholder ?? mask}
        value={text}
        onChange={handleChange}
        className={cn(fieldVariants(), 'teal-u-tabular-nums')}
      />
    </FieldScaffolding>
  )
})
