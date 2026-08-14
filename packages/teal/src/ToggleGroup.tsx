import { forwardRef, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cn } from './cn'

export interface ToggleGroupOption {
  /** Prevents the option from being selected. */
  disabled?: boolean
  /** Optional icon rendered before the label. */
  icon?: ReactNode
  /** Label rendered inside the option. */
  label: ReactNode
  /** Unique value identifying the option. */
  value: string
}

type ToggleGroupRootProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>

/** Single-mode root props, which the segmented variant builds on. */
type ToggleGroupSingleProps = Extract<ToggleGroupRootProps, { type: 'single' }>

/**
 * Radix types the root as a single|multiple union, so this stays a type
 * alias rather than an interface.
 */
export type ToggleGroupProps = ToggleGroupRootProps & {
  /** `segmented` renders `options` on a pill track with a sliding indicator (single-select). */
  variant?: 'default' | 'segmented'
  /** Convenience options rendered by the segmented variant instead of children. */
  options?: ToggleGroupOption[]
  /** Density of the segmented variant. */
  size?: 'sm' | 'md'
}

/**
 * A cluster of toggles with shared focus management. Use `type="single"` for
 * mutually exclusive choices and `type="multiple"` for independent ones.
 * `variant="segmented"` switches to a sliding-pill option switcher driven by
 * the `options` prop.
 */
export const ToggleGroup = forwardRef<React.ComponentRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  function ToggleGroup({ className, options, size = 'md', variant = 'default', ...props }, ref) {
    if (variant === 'segmented' && options) {
      return (
        <SegmentedToggleGroup
          ref={ref}
          className={className}
          options={options}
          size={size}
          {...(props as ToggleGroupSingleProps)}
        />
      )
    }
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn('teal-u-inline-flex teal-u-flex-wrap teal-u-gap-1.5', className)}
        {...props}
      />
    )
  },
)

interface SegmentedToggleGroupProps extends ToggleGroupSingleProps {
  /** Options rendered by the control. */
  options: ToggleGroupOption[]
  /** Density of the control. */
  size?: 'sm' | 'md'
}

/** Pill-track switcher behind `variant="segmented"`; the selection defaults to the first enabled option. */
const SegmentedToggleGroup = forwardRef<HTMLDivElement, SegmentedToggleGroupProps>(function SegmentedToggleGroup(
  { className, defaultValue, onValueChange, options, size = 'md', value, ...props },
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
      className={cn(
        'teal-u-relative teal-u-box-border teal-u-inline-flex teal-u-max-w-full teal-u-items-center teal-u-gap-1 teal-u-overflow-x-auto teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-[calc(0.25rem-1px)] teal-u-text-on-surface-variant',
        'teal-u-bg-surface-container-high',
        className,
      )}
      {...props}
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

export interface ToggleGroupItemProps extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  /** Control size. */
  size?: 'sm' | 'md'
}

/** A single option inside a ToggleGroup, styled to match Toggle. */
export const ToggleGroupItem = forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(function ToggleGroupItem({ className, size = 'md', ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        'teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-justify-center teal-u-gap-1.5 teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-font-semibold teal-u-text-on-surface-variant hover:teal-u-border-[color:var(--teal-border-strong)] hover:teal-u-text-on-surface disabled:teal-u-pointer-events-none disabled:teal-u-opacity-55 data-[state=on]:teal-u-border-primary/30 data-[state=on]:teal-u-bg-primary/10 data-[state=on]:teal-u-text-primary',
        size === 'sm' ? 'teal-u-h-8 teal-u-px-2.5 teal-u-text-xs' : 'teal-u-h-9 teal-u-px-3 teal-u-text-sm',
        className,
      )}
      {...props}
    />
  )
})
