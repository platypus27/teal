import { forwardRef, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { LoaderCircle, Search, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { fieldVariants } from './Input'

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'type' | 'value' | 'defaultValue'> {
  /** Supporting text rendered below the input and linked to it for assistive technology. */
  description?: ReactNode
  /** Visible label rendered above the input. */
  label?: ReactNode
  /** Controlled value. */
  value?: string
  /** Initial value for uncontrolled usage. */
  defaultValue?: string
  /** Called with the new string whenever the value changes, including clears. */
  onValueChange?: (value: string) => void
  /** Called when the clear button is pressed, after the value is cleared. */
  onClear?: () => void
  /** Replaces the clear button with a spinner. */
  loading?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled,
    id,
    label,
    loading = false,
    onClear,
    onValueChange,
    placeholder,
    required,
    value,
    ...props
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-search-input',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)

  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const currentValue = value ?? internalValue

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value)
    onValueChange?.(event.target.value)
  }

  const handleClear = () => {
    setInternalValue('')
    onValueChange?.('')
    onClear?.()
  }

  return (
    <div className="teal-u-grid teal-u-gap-1.5">
      {showLabel ? (
        <label htmlFor={semantics.controlId} className="teal-u-text-sm teal-u-font-medium teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      <div className="teal-u-relative">
        <Search
          aria-hidden="true"
          className="teal-u-pointer-events-none teal-u-absolute teal-u-left-3 teal-u-top-1/2 teal-u-size-4 teal-u--translate-y-1/2 teal-u-text-on-surface-variant"
        />
        <input
          ref={ref}
          type="text"
          id={semantics.controlId}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required ?? semantics.required}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
          className={cn(fieldVariants(), 'teal-u-pl-9 teal-u-pr-8', className)}
          {...props}
        />
        {loading ? (
          <LoaderCircle
            aria-hidden="true"
            className="teal-u-absolute teal-u-right-3 teal-u-top-1/2 teal-u-size-4 teal-u--translate-y-1/2 teal-u-animate-spin teal-u-text-on-surface-variant motion-reduce:teal-u-animate-none"
          />
        ) : currentValue !== '' && !disabled ? (
          <IconButton
            label="Clear search"
            size="sm"
            onClick={handleClear}
            className="teal-u-absolute teal-u-right-1 teal-u-top-1/2 teal-u--translate-y-1/2"
          >
            <X />
          </IconButton>
        ) : null}
      </div>
      {showDescription ? (
        <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  )
})
