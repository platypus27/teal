import { forwardRef, useId, type ReactNode } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from './cn'

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'children'> {
  /** Supporting text rendered below the label. */
  description?: ReactNode
  /** Visible label describing the setting the switch controls. */
  label: ReactNode
  /** Track and thumb size. */
  size?: 'sm' | 'md'
}

export const Switch = forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(function Switch(
  { className, description, id, label, size = 'md', ...props },
  ref,
) {
  const generatedId = useId()
  const controlId = id ?? `teal-switch-${generatedId.replaceAll(':', '')}`
  const descriptionId = description ? `${controlId}-description` : undefined

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="grid gap-0.5">
        <label htmlFor={controlId} className="cursor-pointer text-sm font-medium text-on-surface">
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="text-xs leading-relaxed text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
      <SwitchPrimitive.Root
        ref={ref}
        id={controlId}
        aria-describedby={descriptionId}
        className={cn(
          'relative shrink-0 rounded-full border border-outline-variant bg-surface-container-highest outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary',
          size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'block rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none',
            size === 'sm'
              ? 'size-4 translate-x-0.5 data-[state=checked]:translate-x-[18px]'
              : 'size-5 translate-x-0.5 data-[state=checked]:translate-x-[22px]',
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  )
})
