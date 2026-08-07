import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { cn } from './cn'

export interface FormErrorItem {
  /** id of the form control that receives focus when this error link is activated. */
  fieldId: string
  /** Short field name shown before the message; when omitted only the message is linked. */
  label?: string
  /** Validation message for the field. */
  message: string
}

export interface FormErrorSummaryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Field errors listed as focus links; the summary renders nothing when empty. */
  errors: FormErrorItem[]
  /** Called after an error link is activated, with its item. */
  onErrorClick?: (error: FormErrorItem) => void
  /** Heading text of the summary. */
  title?: ReactNode
}

const focusableSelector = 'a[href], button, input, select, textarea, [tabindex]'

export const FormErrorSummary = forwardRef<HTMLDivElement, FormErrorSummaryProps>(function FormErrorSummary(
  { className, errors, onErrorClick, title = 'There is a problem', ...props },
  ref,
) {
  if (errors.length === 0) return null

  function handleClick(event: MouseEvent<HTMLAnchorElement>, error: FormErrorItem) {
    event.preventDefault()
    const target = document.getElementById(error.fieldId)
    if (target) {
      if (!target.matches(focusableSelector)) target.tabIndex = -1
      target.focus()
    }
    onErrorClick?.(error)
  }

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className={cn(
        'teal-raised-surface teal-u-flex teal-u-items-start teal-u-gap-3 teal-u-border teal-u-p-4 teal-u-text-sm teal-u-shadow-none',
        'teal-u-border-[color:color-mix(in_srgb,var(--teal-color-error)_40%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-error)_12%,var(--teal-color-surface))] teal-u-text-on-surface',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="teal-u-mt-0.5 teal-u-shrink-0 teal-u-text-error [&_svg]:teal-u-size-[var(--teal-icon-md)]">
        <CircleAlert />
      </span>
      <div className="teal-u-min-w-0 teal-u-flex-1">
        <p className="teal-u-font-semibold">{title}</p>
        <ul className="teal-u-mt-1 teal-u-list-disc teal-u-space-y-1 teal-u-pl-5">
          {errors.map((error) => (
            <li key={error.fieldId}>
              <a
                href={`#${error.fieldId}`}
                onClick={(event) => handleClick(event, error)}
                className="teal-focus-ring teal-u-rounded-sm teal-u-font-medium teal-u-text-error teal-u-underline teal-u-underline-offset-2 hover:teal-u-text-error/80"
              >
                {error.label ? `${error.label}: ${error.message}` : error.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})
