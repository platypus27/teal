import { forwardRef, type ReactNode } from 'react'
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
  return (
    <TabsPrimitive.Root
      ref={ref}
      className={cn('teal-u-w-full', className)}
      {...(value !== undefined ? { value } : {})}
      {...(initialValue !== undefined ? { defaultValue: initialValue } : {})}
      {...(onValueChange ? { onValueChange } : {})}
    >
      <TabsPrimitive.List
        aria-label={ariaLabel}
        className={cn(
          'teal-u-box-border teal-u-inline-flex teal-u-max-w-full teal-u-items-center teal-u-gap-1 teal-u-overflow-x-auto teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-[calc(0.25rem-1px)] teal-u-text-on-surface-variant',
          'teal-u-bg-surface-container-high',
        )}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="teal-focus-ring teal-u-whitespace-nowrap teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-font-semibold hover:teal-u-text-on-surface disabled:teal-u-pointer-events-none disabled:teal-u-opacity-45 data-[state=active]:teal-u-bg-surface data-[state=active]:teal-u-text-on-surface data-[state=active]:teal-u-shadow-sm"
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="teal-focus-ring teal-u-mt-4 teal-u-rounded-lg"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
})
