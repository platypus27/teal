import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import { isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

const fieldVariants = cva(
  'teal-focus-ring teal-u-box-border teal-u-w-full teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-strong)] teal-u-bg-surface teal-u-text-on-surface placeholder:teal-u-text-on-surface-variant hover:teal-u-border-outline focus-visible:teal-u-border-primary disabled:teal-u-cursor-not-allowed disabled:teal-u-bg-surface-container-high disabled:teal-u-opacity-55 aria-[invalid=true]:teal-u-border-error aria-[invalid=true]:teal-u-shadow-[0_0_0_3px_color-mix(in_srgb,var(--teal-color-error)_20%,transparent)]',
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
    VariantProps<typeof fieldVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { 'aria-describedby': describedBy, 'aria-invalid': invalid, className, id, required, size, ...props },
  ref,
) {
  const semantics = useFormSemantics({ id, invalid: isAriaTrue(invalid), prefix: 'teal-input', required })
  return (
    <input
      ref={ref}
      id={semantics.controlId}
      required={required ?? semantics.required}
      aria-invalid={invalid ?? (semantics.invalid || undefined)}
      aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
      className={cn(fieldVariants({ size }), className)}
      {...props}
    />
  )
})

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof fieldVariants> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { 'aria-describedby': describedBy, 'aria-invalid': invalid, className, id, required, size, ...props },
  ref,
) {
  const semantics = useFormSemantics({ id, invalid: isAriaTrue(invalid), prefix: 'teal-textarea', required })
  return (
    <textarea
      ref={ref}
      id={semantics.controlId}
      required={required ?? semantics.required}
      aria-invalid={invalid ?? (semantics.invalid || undefined)}
      aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
      className={cn(fieldVariants({ size }), 'teal-u-min-h-28 teal-u-resize-y teal-u-leading-relaxed', className)}
      {...props}
    />
  )
})

export { fieldVariants }
