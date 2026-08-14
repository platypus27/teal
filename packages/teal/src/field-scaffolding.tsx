import type { ReactNode } from 'react'
import { cn } from './cn'
import { hasFormContent } from './form-semantics'

export interface FieldScaffoldingProps {
  children: ReactNode
  className?: string | undefined
  /** Id of the interactive control the label points at. */
  controlId: string
  /** Supporting text rendered below the control. */
  description?: ReactNode
  /** Id for the description element (from useFormSemantics). */
  descriptionId?: string | undefined
  /** Visible label rendered above the control. */
  label?: ReactNode
  /** Set when a surrounding Field renders the label instead. */
  labeledByField?: boolean | undefined
}

export function FieldScaffolding({
  children,
  className,
  controlId,
  description,
  descriptionId,
  label,
  labeledByField,
}: FieldScaffoldingProps) {
  const showLabel = hasFormContent(label) && !labeledByField
  const showDescription = hasFormContent(description)
  return (
    <div className={cn('teal-u-grid teal-u-gap-1.5', className)}>
      {showLabel ? (
        <label htmlFor={controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      {children}
      {showDescription ? (
        <p id={descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  )
}
