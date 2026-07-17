import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from './cn'
import { fieldVariants } from './Input'
import { isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface SelectOption {
  /** Prevents the option from being selected. */
  disabled?: boolean
  /** Visible label of the option. */
  label: ReactNode
  /** Text used for typeahead and screen readers when the label is not a string. */
  textValue?: string
  /** Value reported when the option is selected. */
  value: string
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'children'> {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the trigger invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  className?: string
  /** Options rendered in the listbox. */
  options: SelectOption[]
  /** Text shown when no value is selected. */
  placeholder?: ReactNode
  /** Size of the trigger button. */
  size?: 'sm' | 'md' | 'lg'
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-invalid': invalid,
    autoComplete,
    className,
    defaultOpen,
    defaultValue,
    dir,
    disabled,
    id,
    name,
    onOpenChange,
    onValueChange,
    open,
    options,
    placeholder = 'Select an option',
    required,
    size,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({ id, invalid: isAriaTrue(invalid), prefix: 'teal-select' })
  return (
    <SelectPrimitive.Root
      {...(required !== undefined || semantics.required
        ? { required: semantics.required }
        : {})}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onValueChange ? { onValueChange } : {})}
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
      {...(name !== undefined ? { name } : {})}
      {...(dir !== undefined ? { dir } : {})}
      {...(autoComplete !== undefined ? { autoComplete } : {})}
    >
      <SelectPrimitive.Trigger
        ref={ref}
        id={semantics.controlId}
        aria-label={ariaLabel}
        aria-invalid={invalid ?? (semantics.invalid || undefined)}
        aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
        className={cn(
          fieldVariants({ size }),
          'flex items-center justify-between gap-2 text-left data-[placeholder]:text-on-surface-variant',
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-on-surface-variant" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={cn(
            'z-[var(--teal-z-popover)] max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container text-on-surface shadow-[var(--teal-shadow-overlay)]',
          )}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex min-h-9 cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
                {...(option.disabled !== undefined ? { disabled: option.disabled } : {})}
                {...(option.textValue || typeof option.label === 'string'
                  ? { textValue: option.textValue ?? String(option.label) }
                  : {})}
              >
                <span className="absolute left-2 flex size-4 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
})
