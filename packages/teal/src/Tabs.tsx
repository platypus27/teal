import { type ReactNode } from 'react'
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

export function Tabs({ 'aria-label': ariaLabel, className, defaultValue, items, onValueChange, value }: TabsProps) {
  const initialValue = defaultValue ?? items.find((item) => !item.disabled)?.value
  return (
    <TabsPrimitive.Root
      className={cn('w-full', className)}
      {...(value !== undefined ? { value } : {})}
      {...(initialValue !== undefined ? { defaultValue: initialValue } : {})}
      {...(onValueChange ? { onValueChange } : {})}
    >
      <TabsPrimitive.List
        aria-label={ariaLabel}
        className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-surface-container-high p-1 text-on-surface-variant"
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-colors hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-45 data-[state=active]:bg-surface data-[state=active]:text-on-surface data-[state=active]:shadow-sm"
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="mt-4 outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
