import { createContext, forwardRef, useContext, useId, type HTMLAttributes, type ReactNode } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from './cn'

interface FieldContextValue {
  controlId: string
  descriptionId: string | undefined
  errorId: string | undefined
  invalid: boolean
  required: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

export function useFieldControl() {
  return useContext(FieldContext)
}

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export const Label = forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(function Label(
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
}

export function Field({ children, className, description, error, id, label, required = false, ...props }: FieldProps) {
  const generatedId = useId()
  const controlId = id ?? `teal-field-${generatedId.replaceAll(':', '')}`
  const descriptionId = description ? `${controlId}-description` : undefined
  const errorId = error ? `${controlId}-error` : undefined

  return (
    <FieldContext.Provider
      value={{ controlId, descriptionId, errorId, invalid: Boolean(error), required }}
    >
      <div className={cn('grid gap-1.5', className)} {...props}>
        <Label htmlFor={controlId}>
          {label}
          {required ? <span className="ml-1 text-error" aria-hidden="true">*</span> : null}
        </Label>
        {children}
        {description ? (
          <p id={descriptionId} className="text-xs leading-relaxed text-on-surface-variant">
            {description}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs font-medium leading-relaxed text-error">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  )
}

export function mergeDescriptionIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(' ')
  return value || undefined
}
