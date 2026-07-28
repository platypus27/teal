import { forwardRef, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from './cn'

export interface TabItem {
  /** Panel content rendered while the tab is active. */
  content: ReactNode
  /** Prevents the tab from being selected. */
  disabled?: boolean
  /** Label rendered inside the tab trigger. */
  label: ReactNode
  /** Unique value identifying the tab. */
  value: string
}

export interface TabsProps {
  /** Accessible name for the tab list. */
  'aria-label': string
  className?: string
  /** Initially active tab when uncontrolled. */
  defaultValue?: string
  /** Tabs rendered by the component. */
  items: TabItem[]
  /** Called with the new value when the active tab changes. */
  onValueChange?: (value: string) => void
  /** Controlled active tab value. */
  value?: string
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { 'aria-label': ariaLabel, className, defaultValue, items, onValueChange, value },
  ref,
) {
  const initialValue = defaultValue ?? items.find((item) => !item.disabled)?.value
  const [internalValue, setInternalValue] = useState(initialValue)
  const activeValue = value ?? internalValue
  const listRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

  // Measure the active trigger so a single pill can slide behind it.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return undefined
    const measure = () => {
      const active = list.querySelector<HTMLElement>('[data-state="active"]')
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
  }, [activeValue, items])

  const handleValueChange = (next: string) => {
    setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <TabsPrimitive.Root
      ref={ref}
      className={cn('teal-u-w-full', className)}
      {...(activeValue !== undefined ? { value: activeValue } : {})}
      onValueChange={handleValueChange}
    >
      <TabsPrimitive.List
        ref={listRef}
        aria-label={ariaLabel}
        className={cn(
          'teal-u-relative teal-u-box-border teal-u-inline-flex teal-u-max-w-full teal-u-items-center teal-u-gap-1 teal-u-overflow-x-auto teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-[calc(0.25rem-1px)] teal-u-text-on-surface-variant',
          'teal-u-bg-surface-container-high',
        )}
      >
        {indicator ? (
          <span
            aria-hidden="true"
            className="teal-u-absolute teal-u-bottom-1 teal-u-left-0 teal-u-top-1 teal-u-rounded-lg teal-u-bg-surface teal-u-shadow-sm teal-u-transition-[transform,width] teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none"
            style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
          />
        ) : null}
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="teal-focus-ring teal-u-relative teal-u-whitespace-nowrap teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-font-semibold teal-u-bg-transparent hover:teal-u-text-on-surface disabled:teal-u-pointer-events-none disabled:teal-u-opacity-45 data-[state=active]:teal-u-text-on-surface"
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="teal-tab-panel teal-focus-ring teal-u-mt-4 teal-u-rounded-lg"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
})
