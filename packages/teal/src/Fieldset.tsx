import { forwardRef, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'
import { hasFormContent } from './form-semantics'

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Caption rendered as the fieldset legend; names the group for assistive technology. */
  legend: ReactNode
  /** Help text rendered below the legend and linked to the group for assistive technology. */
  description?: ReactNode
}

/**
 * Groups related fields under a semantic fieldset/legend pair, for example a
 * set of Fields that together answer one question.
 */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { children, className, description, legend, ...props },
  ref,
) {
  const generatedId = useId().replaceAll(':', '')
  const descriptionId = `teal-fieldset-${generatedId}-description`
  const showDescription = hasFormContent(description)

  return (
    <fieldset
      ref={ref}
      aria-describedby={showDescription ? descriptionId : undefined}
      className={cn('teal-u-m-0 teal-u-min-w-0 teal-u-border-0 teal-u-p-0', className)}
      {...props}
    >
      <legend className="teal-u-mb-1 teal-u-p-0 teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
        {legend}
      </legend>
      {showDescription ? (
        <p id={descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
      <div className="teal-u-mt-4 teal-u-grid teal-u-gap-4">{children}</div>
    </fieldset>
  )
})
