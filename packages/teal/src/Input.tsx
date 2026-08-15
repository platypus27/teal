import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Eye, EyeOff, LoaderCircle, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { FieldScaffolding } from './field-scaffolding'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

const fieldVariants = cva(
  'teal-focus-ring teal-u-box-border teal-u-w-full teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-text-on-surface placeholder:teal-u-text-on-surface-variant hover:teal-u-border-outline focus-visible:teal-u-border-primary disabled:teal-u-cursor-not-allowed disabled:teal-u-bg-surface-container-high disabled:teal-u-opacity-55 aria-[invalid=true]:teal-u-border-error aria-[invalid=true]:teal-u-shadow-[0_0_0_3px_color-mix(in_srgb,var(--teal-color-error)_20%,transparent)]',
  {
    variants: {
      size: {
        sm: 'teal-u-min-h-8 teal-u-px-3 teal-u-py-1.5 teal-u-text-xs',
        md: 'teal-u-min-h-10 teal-u-px-4 teal-u-py-2.5 teal-u-text-sm',
        lg: 'teal-u-min-h-12 teal-u-px-4 teal-u-py-3 teal-u-text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof fieldVariants> {
  /** Shows a clear button once the field has a value. Ignored when type="password". */
  clearable?: boolean
  /** Accessible label for the clear button. */
  clearLabel?: string
  /** Supporting text rendered below the input and linked to it for assistive technology. */
  description?: ReactNode
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Replaces the clear button with a spinner in the same trailing slot. Ignored when type="password". */
  loading?: boolean
  /** Called when the clear button is pressed, after the value is cleared. */
  onClear?: () => void
  /** Called with the new string whenever the value changes, alongside the native onChange. */
  onValueChange?: (value: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    className,
    clearable = false,
    clearLabel = 'Clear input',
    defaultValue,
    description,
    disabled,
    id,
    label,
    loading = false,
    onChange,
    onClear,
    onValueChange,
    required,
    size,
    type = 'text',
    value,
    ...props
  },
  ref,
) {
  const isPassword = type === 'password'
  const hasTrailingSlot = isPassword || clearable || loading
  const wrapped = hasTrailingSlot || hasFormContent(label) || hasFormContent(description)
  const semantics = useFormSemantics({ description, id, invalid: isAriaTrue(invalid), prefix: 'teal-input', required })

  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const currentValue = value ?? internalValue
  const [visible, setVisible] = useState(false)

  if (!wrapped) {
    return (
      <input
        ref={ref}
        id={semantics.controlId}
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required ?? semantics.required}
        aria-invalid={invalid ?? (semantics.invalid || undefined)}
        aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
        className={cn(fieldVariants({ size }), className)}
        {...props}
      />
    )
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInternalValue(event.target.value)
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  function handleClear() {
    setInternalValue('')
    onValueChange?.('')
    onClear?.()
  }

  return (
    <FieldScaffolding
      controlId={semantics.controlId}
      description={description}
      descriptionId={semantics.descriptionId}
      label={label}
      labeledByField={semantics.labeledByField}
    >
      <div className="teal-u-relative">
        <input
          ref={ref}
          id={semantics.controlId}
          type={isPassword ? (visible ? 'text' : 'password') : type}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          required={required ?? semantics.required}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
          className={cn(fieldVariants({ size }), hasTrailingSlot && 'teal-u-pr-10', className)}
          {...props}
        />
        {isPassword ? (
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
        ) : loading ? (
          <span
            role="status"
            aria-label="Loading"
            className="teal-u-absolute teal-u-right-1 teal-u-top-1/2 teal-u-flex teal-u-size-8 teal-u-items-center teal-u-justify-center teal-u--translate-y-1/2"
          >
            <LoaderCircle aria-hidden="true" className="teal-u-size-4 teal-u-animate-spin teal-u-text-on-surface-variant motion-reduce:teal-u-animate-none" />
          </span>
        ) : clearable && currentValue !== '' && !disabled ? (
          <IconButton
            label={clearLabel}
            size="sm"
            onClick={handleClear}
            className="teal-u-absolute teal-u-right-1 teal-u-top-1/2 teal-u--translate-y-1/2"
          >
            <X />
          </IconButton>
        ) : null}
      </div>
    </FieldScaffolding>
  )
})

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof fieldVariants> {
  /** Grow and shrink with the content instead of showing a resize handle. */
  autosize?: boolean
  /** Supporting text rendered below the textarea. */
  description?: ReactNode
  /** Visible label rendered above the textarea. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Maximum rows shown before an autosize textarea scrolls instead of growing. */
  maxRows?: number
  /** Rows shown when the content is short (autosize mode only). */
  minRows?: number
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    autosize = false,
    className,
    description,
    id,
    label,
    maxRows,
    minRows = 1,
    onChange,
    required,
    size,
    style,
    value,
    ...props
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-textarea',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)

  const innerRef = useRef<HTMLTextAreaElement | null>(null)

  const resize = useCallback(() => {
    const element = innerRef.current
    if (!element) return
    const computed = window.getComputedStyle(element)
    const toPx = (value: string) => parseFloat(value) || 0
    const lineHeight = toPx(computed.lineHeight) || 20
    const extras =
      toPx(computed.paddingTop) +
      toPx(computed.paddingBottom) +
      toPx(computed.borderTopWidth) +
      toPx(computed.borderBottomWidth)
    const minHeight = minRows * lineHeight + extras
    const maxHeight = maxRows !== undefined ? maxRows * lineHeight + extras : Infinity
    element.style.height = 'auto'
    const next = Math.min(Math.max(element.scrollHeight, minHeight), maxHeight)
    element.style.height = `${next}px`
    element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [maxRows, minRows])

  useLayoutEffect(() => {
    if (autosize) resize()
  }, [autosize, resize, value])

  function setRefs(node: HTMLTextAreaElement | null) {
    innerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    resize()
    onChange?.(event)
  }

  const textarea = autosize ? (
    <textarea
      ref={setRefs}
      id={semantics.controlId}
      rows={minRows}
      required={required ?? semantics.required}
      aria-invalid={invalid ?? (semantics.invalid || undefined)}
      aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
      onChange={handleChange}
      style={{ resize: 'none', ...style }}
      value={value}
      className={cn(fieldVariants({ size }), 'teal-u-box-border teal-u-leading-relaxed', className)}
      {...props}
    />
  ) : (
    <textarea
      ref={ref}
      id={semantics.controlId}
      required={required ?? semantics.required}
      aria-invalid={invalid ?? (semantics.invalid || undefined)}
      aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
      onChange={onChange}
      style={style}
      value={value}
      className={cn(fieldVariants({ size }), 'teal-u-min-h-28 teal-u-resize-y teal-u-leading-relaxed', className)}
      {...props}
    />
  )

  if (!showLabel && !showDescription) return textarea

  return (
    <div className="teal-u-grid teal-u-gap-1.5">
      {showLabel ? (
        <label htmlFor={semantics.controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      {textarea}
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
})

export { fieldVariants }
