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
      className={cn('teal-raised-surface teal-u-divide-y teal-u-divide-outline-variant/40 teal-u-border teal-u-bg-surface-container', className)}
      {...modeProps}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.value}
          value={item.value}
          {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
          className="teal-u-px-4"
        >
          <AccordionPrimitive.Header className="teal-u-flex">
            <AccordionPrimitive.Trigger className="teal-focus-ring teal-u-group teal-u-flex teal-u-flex-1 teal-u-items-center teal-u-justify-between teal-u-gap-2 teal-u-rounded-lg teal-u-py-4 teal-u-text-left teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface hover:teal-u-text-primary disabled:teal-u-pointer-events-none disabled:teal-u-opacity-45">
              {item.title}
              <ChevronDown
                aria-hidden="true"
                className="teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0 teal-u-text-on-surface-variant teal-u-transition-transform teal-u-duration-[var(--teal-motion-standard)] group-data-[state=open]:teal-u-rotate-180 motion-reduce:teal-u-transition-none"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="teal-u-pb-4 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
            {item.content}
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
})
