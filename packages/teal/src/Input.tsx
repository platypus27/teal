import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import { mergeDescriptionIds, useFieldControl } from './Field'

const fieldVariants = cva(
  'w-full rounded-xl border border-outline-variant bg-surface-container-highest text-on-surface outline-none transition-colors placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-55 aria-[invalid=true]:border-error aria-[invalid=true]:ring-error/20',
  {
    variants: {
      size: {
        sm: 'min-h-8 px-3 py-1.5 text-xs',
        md: 'min-h-10 px-4 py-2.5 text-sm',
        lg: 'min-h-12 px-4 py-3 text-base',
      },
      glass: {
        true: 'bg-surface-container/80 backdrop-blur-xl border-outline-variant/30',
        false: '',
      },
    },
    defaultVariants: { size: 'md', glass: false },
  },
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof fieldVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { 'aria-describedby': describedBy, 'aria-invalid': invalid, className, glass, id, required, size, ...props },
  ref,
) {
  const field = useFieldControl()
  return (
    <input
      ref={ref}
      id={id ?? field?.controlId}
      required={required ?? field?.required}
      aria-invalid={invalid ?? (field?.invalid || undefined)}
      aria-describedby={mergeDescriptionIds(describedBy, field?.descriptionId, field?.errorId)}
      className={cn(fieldVariants({ size, glass }), className)}
      {...props}
    />
  )
})

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof fieldVariants> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { 'aria-describedby': describedBy, 'aria-invalid': invalid, className, glass, id, required, size, ...props },
  ref,
) {
  const field = useFieldControl()
  return (
    <textarea
      ref={ref}
      id={id ?? field?.controlId}
      required={required ?? field?.required}
      aria-invalid={invalid ?? (field?.invalid || undefined)}
      aria-describedby={mergeDescriptionIds(describedBy, field?.descriptionId, field?.errorId)}
      className={cn(fieldVariants({ size, glass }), 'min-h-28 resize-y leading-relaxed', className)}
      {...props}
    />
  )
})

export { fieldVariants }
