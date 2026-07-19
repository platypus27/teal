import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import { isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

const fieldVariants = cva(
  'teal-focus-ring box-border w-full rounded-xl border border-solid border-[color:var(--teal-border-strong)] bg-surface text-on-surface placeholder:text-on-surface-variant hover:border-outline focus-visible:border-primary disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:opacity-55 aria-[invalid=true]:border-error aria-[invalid=true]:shadow-[0_0_0_3px_rgb(var(--color-error)/0.2)]',
  {
    variants: {
      size: {
        sm: 'min-h-8 px-3 py-1.5 text-xs',
        md: 'min-h-10 px-4 py-2.5 text-sm',
        lg: 'min-h-12 px-4 py-3 text-base',
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
      className={cn(fieldVariants({ size }), 'min-h-28 resize-y leading-relaxed', className)}
      {...props}
    />
  )
})

export { fieldVariants }
