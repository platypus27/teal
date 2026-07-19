import { forwardRef, type ReactNode } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from './cn'

export interface AccordionItem {
  /** Panel content rendered while the item is open. */
  content: ReactNode
  /** Prevents the item from being toggled. */
  disabled?: boolean
  /** Header label rendered inside the trigger button. */
  title: ReactNode
  /** Unique value identifying the item. */
  value: string
}

interface AccordionBaseProps {
  className?: string
  /** Items rendered by the accordion. */
  items: AccordionItem[]
}

export type AccordionProps = AccordionBaseProps &
  (
    | {
        /** Single-open mode: at most one item is open. */
        multiple?: false
        defaultValue?: string
        onValueChange?: (value: string) => void
        value?: string
      }
    | {
        /** Multi-open mode: any number of items can be open. */
        multiple: true
        defaultValue?: string[]
        onValueChange?: (value: string[]) => void
        value?: string[]
      }
  )

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { className, defaultValue, items, multiple = false, onValueChange, value },
  ref,
) {
  const modeProps = multiple
    ? {
        type: 'multiple' as const,
        ...(value !== undefined ? { value: value as string[] } : {}),
        ...(defaultValue !== undefined ? { defaultValue: defaultValue as string[] } : {}),
        ...(onValueChange ? { onValueChange: onValueChange as (value: string[]) => void } : {}),
      }
    : {
        type: 'single' as const,
        collapsible: true,
        ...(value !== undefined ? { value: value as string } : {}),
        ...(defaultValue !== undefined ? { defaultValue: defaultValue as string } : {}),
        ...(onValueChange ? { onValueChange: onValueChange as (value: string) => void } : {}),
      }
  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn('teal-raised-surface divide-y divide-outline-variant/40 border bg-surface-container', className)}
      {...modeProps}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.value}
          value={item.value}
          {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
          className="px-4"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="teal-focus-ring group flex flex-1 items-center justify-between gap-2 rounded-lg py-4 text-left text-sm font-semibold text-on-surface hover:text-primary disabled:pointer-events-none disabled:opacity-45">
              {item.title}
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-on-surface-variant transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="pb-4 text-sm leading-relaxed text-on-surface-variant">
            {item.content}
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
})
