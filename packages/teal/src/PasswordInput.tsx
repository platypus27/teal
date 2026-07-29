import { forwardRef, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { fieldVariants } from './Input'

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'type' | 'value' | 'defaultValue'> {
  /** Supporting text rendered below the input and linked to it for assistive technology. */
  description?: ReactNode
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Controlled value. */
  value?: string
  /** Initial value for uncontrolled usage. */
  defaultValue?: string
  /** Called with the new string whenever the value changes. */
  onValueChange?: (value: string) => void
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled,
    id,
    label,
    onValueChange,
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
    prefix: 'teal-password-input',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)

  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const currentValue = value ?? internalValue
  const [visible, setVisible] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value)
    onValueChange?.(event.target.value)
  }

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
          type={visible ? 'text' : 'password'}
          id={semantics.controlId}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          required={required ?? semantics.required}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
          className={cn(fieldVariants(), 'teal-u-pr-10')}
          {...props}
        />
        <IconButton
          label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          size="sm"
          disabled={disabled}
          onClick={() => setVisible((current) => !current)}
          className="teal-u-absolute teal-u-right-1 teal-u-top-1/2 teal-u--translate-y-1/2"
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </IconButton>
      </div>
      {showDescription ? (
        <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  )
})
