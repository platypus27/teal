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
  const semantics = useFormSemantics({
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-select',
    required,
  })
  return (
    <SelectPrimitive.Root
      {...(required !== undefined || semantics.required ? { required: semantics.required } : {})}
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
          'teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-2 teal-u-text-left data-[placeholder]:teal-u-text-on-surface-variant',
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0 teal-u-text-on-surface-variant" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={cn(
            'teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-max-h-[var(--radix-select-content-available-height)] teal-u-min-w-[var(--radix-select-trigger-width)] teal-u-overflow-hidden teal-u-border teal-u-bg-surface teal-u-text-on-surface',
          )}
        >
          <SelectPrimitive.Viewport className="teal-u-p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="teal-focus-ring teal-u-relative teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-py-2 teal-u-pl-8 teal-u-pr-3 teal-u-text-sm data-[disabled]:teal-u-pointer-events-none data-[disabled]:teal-u-opacity-45 data-[highlighted]:teal-u-bg-primary/10 data-[highlighted]:teal-u-text-primary"
                {...(option.disabled !== undefined ? { disabled: option.disabled } : {})}
                {...(option.textValue || typeof option.label === 'string'
                  ? { textValue: option.textValue ?? String(option.label) }
                  : {})}
              >
                <span className="teal-u-absolute teal-u-left-2 teal-u-flex teal-u-size-[var(--teal-icon-sm)] teal-u-items-center teal-u-justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
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
