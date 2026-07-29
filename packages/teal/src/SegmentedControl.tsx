import { forwardRef, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cn } from './cn'

export interface SegmentedControlOption {
  /** Prevents the option from being selected. */
  disabled?: boolean
  /** Optional icon rendered before the label. */
  icon?: ReactNode
  /** Label rendered inside the option. */
  label: ReactNode
  /** Unique value identifying the option. */
  value: string
}

export interface SegmentedControlProps {
  /** Accessible name for the control. */
  'aria-label': string
  className?: string
  /** Initially selected value when uncontrolled. Defaults to the first enabled option. */
  defaultValue?: string
  /** Called with the new value when the selection changes. */
  onValueChange?: (value: string) => void
  /** Options rendered by the control. */
  options: SegmentedControlOption[]
  /** Density of the control. */
  size?: 'sm' | 'md'
  /** Controlled selected value. */
  value?: string
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { 'aria-label': ariaLabel, className, defaultValue, onValueChange, options, size = 'md', value },
  ref,
) {
  const initialValue = defaultValue ?? options.find((option) => !option.disabled)?.value
  const [internalValue, setInternalValue] = useState(initialValue)
  const activeValue = value ?? internalValue
  const listRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

  // Measure the selected item so a single pill can slide behind it.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return undefined
    const measure = () => {
      const active = list.querySelector<HTMLElement>('[data-state="on"]')
      setIndicator((previous) => {
        if (!active) return previous === null ? previous : null
        const next = { left: active.offsetLeft, width: active.offsetWidth }
        return previous && previous.left === next.left && previous.width === next.width ? previous : next
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    document.fonts?.ready.then(measure).catch(() => undefined)
    return () => observer.disconnect()
  }, [activeValue, options])

  const handleValueChange = (next: string) => {
    setInternalValue(next)
    onValueChange?.(next)
  }

  const setRefs = (node: HTMLDivElement | null) => {
    listRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  return (
    <ToggleGroupPrimitive.Root
      ref={setRefs}
      type="single"
      aria-label={ariaLabel}
      className={cn(
        'teal-u-relative teal-u-box-border teal-u-inline-flex teal-u-max-w-full teal-u-items-center teal-u-gap-1 teal-u-overflow-x-auto teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-[calc(0.25rem-1px)] teal-u-text-on-surface-variant',
        'teal-u-bg-surface-container-high',
        className,
      )}
      {...(activeValue !== undefined ? { value: activeValue } : {})}
      onValueChange={handleValueChange}
    >
      {indicator ? (
        <span
          aria-hidden="true"
          className="teal-u-absolute teal-u-bottom-1 teal-u-left-0 teal-u-top-1 teal-u-rounded-lg teal-u-bg-surface teal-u-shadow-sm teal-u-transition-[transform,width] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none"
          style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
        />
      ) : null}
      {options.map((option) => (
        <ToggleGroupPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            'teal-focus-ring teal-u-relative teal-u-inline-flex teal-u-items-center teal-u-justify-center teal-u-gap-1.5 teal-u-whitespace-nowrap teal-u-rounded-lg teal-u-px-3 teal-u-font-semibold teal-u-bg-transparent hover:teal-u-text-on-surface disabled:teal-u-pointer-events-none disabled:teal-u-opacity-45 data-[state=on]:teal-u-text-on-surface [&_svg]:teal-u-size-[var(--teal-icon-sm)]',
            size === 'sm' ? 'teal-u-py-1 teal-u-text-xs' : 'teal-u-py-1.5 teal-u-text-sm',
          )}
        >
          {option.icon}
          {option.label}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  )
})
