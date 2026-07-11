import { forwardRef, useId, type ReactNode } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from './cn'

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'children'> {
  description?: ReactNode
  label: ReactNode
  visuallyHiddenLabel?: boolean
}

export const Checkbox = forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox({ className, description, id, label, visuallyHiddenLabel = false, ...props }, ref) {
    const generatedId = useId()
    const controlId = id ?? `teal-checkbox-${generatedId.replaceAll(':', '')}`
    const descriptionId = description ? `${controlId}-description` : undefined

    return (
      <div className="flex items-start gap-2.5">
        <CheckboxPrimitive.Root
          ref={ref}
          id={controlId}
          aria-describedby={descriptionId}
          className={cn(
            'group mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-outline-variant bg-surface-container-highest text-on-primary outline-none transition-colors hover:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
            className,
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator>
            <Minus
              aria-hidden="true"
              className="hidden size-3.5 group-data-[state=indeterminate]:block"
              strokeWidth={3}
            />
            <Check
              aria-hidden="true"
              className="size-3.5 group-data-[state=indeterminate]:hidden"
              strokeWidth={3}
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <div className="grid gap-0.5">
          <label
            htmlFor={controlId}
            className={cn('cursor-pointer text-sm font-medium text-on-surface', visuallyHiddenLabel && 'sr-only')}
          >
            {label}
          </label>
          {description ? (
            <p id={descriptionId} className="text-xs leading-relaxed text-on-surface-variant">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    )
  },
)
