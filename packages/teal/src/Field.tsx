import { forwardRef, type ElementRef, type HTMLAttributes, type ReactNode } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from './cn'
import { FormSemanticsContext, hasFormContent, mergeDescriptionIds, useFormSemantics, useFormSemanticsContext } from './form-semantics'

export function useFieldControl() {
  return useFormSemanticsContext()
}

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn('text-sm font-semibold text-on-surface', className)}
      {...props}
    />
  )
})

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The form control this field labels and describes. */
  children: ReactNode
  /** Help text rendered below the control and linked to it for assistive technology. */
  description?: ReactNode
  /** Error message; marks the control as invalid and links the message to it. */
  error?: ReactNode
  /** Visible label associated with the control. */
  label: ReactNode
  /** Marks the control as required and renders a required indicator. */
  required?: boolean
  /** Marks the control invalid without requiring a visible error message. */
  invalid?: boolean
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { children, className, description, error, id, invalid, label, required = false, ...props },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    error,
    id,
    invalid,
    prefix: 'teal-field',
    required,
  })

  return (
    <FormSemanticsContext.Provider value={semantics}>
      <div ref={ref} className={cn('grid gap-1.5', className)} {...props}>
        <Label htmlFor={semantics.controlId}>
          {label}
          {required ? <span className="ml-1 text-error" aria-hidden="true">*</span> : null}
        </Label>
        {children}
        {hasFormContent(description) ? (
          <p id={semantics.descriptionId} className="text-xs leading-relaxed text-on-surface-variant">
            {description}
          </p>
        ) : null}
        {hasFormContent(error) ? (
          <p id={semantics.errorId} className="text-xs font-medium leading-relaxed text-error">
            {error}
          </p>
        ) : null}
      </div>
    </FormSemanticsContext.Provider>
  )
})

export { mergeDescriptionIds }
