import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'
import { fieldVariants } from './Input'

export interface AutosizeTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  /** Supporting text rendered below the textarea. */
  description?: ReactNode
  /** Visible label rendered above the textarea. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Maximum rows shown before the textarea scrolls instead of growing. */
  maxRows?: number
  /** Rows shown when the content is short. */
  minRows?: number
}

export const AutosizeTextarea = forwardRef<HTMLTextAreaElement, AutosizeTextareaProps>(
  function AutosizeTextarea(
    {
      'aria-describedby': describedBy,
      'aria-invalid': invalid,
      className,
      description,
      id,
      label,
      maxRows,
      minRows = 1,
      onChange,
      required,
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
      prefix: 'teal-autosize-textarea',
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
      resize()
    }, [resize, value])

    function setRefs(node: HTMLTextAreaElement | null) {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
      resize()
      onChange?.(event)
    }

    return (
      <div className={cn('teal-u-grid teal-u-gap-1.5', className)}>
        {showLabel ? (
          <label htmlFor={semantics.controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
            {label}
          </label>
        ) : null}
        <textarea
          ref={setRefs}
          id={semantics.controlId}
          rows={minRows}
          required={required ?? semantics.required}
          aria-invalid={invalid ?? (semantics.invalid || undefined)}
          aria-describedby={mergeDescriptionIds(describedBy, showDescription ? semantics.descriptionId : undefined)}
          onChange={handleChange}
          style={{ resize: 'none', ...style }}
          value={value}
          className={cn(fieldVariants(), 'teal-u-box-border teal-u-leading-relaxed', className)}
          {...props}
        />
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
