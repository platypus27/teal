import { forwardRef, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from './cn'
import { Input } from './Input'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface ComboboxOption {
  /** Prevents the option from being selected. */
  disabled?: boolean
  /** Visible label of the option; also used for filtering. */
  label: string
  /** Value reported when the option is selected. */
  value: string
}

export interface ComboboxProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the input invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  className?: string
  /** Initial selected value when uncontrolled. */
  defaultValue?: string
  /** Supporting text rendered below the input. */
  description?: ReactNode
  /** Prevents interaction with the input. */
  disabled?: boolean
  /** Message shown when no option matches the typed text. */
  emptyMessage?: ReactNode
  /** Visible label rendered above the input. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Called with the value of the selected option. */
  onValueChange?: (value: string) => void
  /** Options rendered in the filtered listbox. */
  options: ComboboxOption[]
  /** Text shown when no value is selected. */
  placeholder?: string
  /** Marks the input as required. */
  required?: boolean
  /** Controlled selected value. */
  value?: string
}

function optionId(listboxId: string, index: number) {
  return `${listboxId}-option-${index}`
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled,
    emptyMessage = 'No matches',
    id,
    label,
    onValueChange,
    options,
    placeholder = 'Search…',
    required,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-combobox',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const listboxId = `${semantics.controlId}-listbox`

  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = value !== undefined ? value : internalValue
  const selectedOption = options.find((option) => option.value === selectedValue)

  const [open, setOpen] = useState(false)
  const [inputText, setInputText] = useState(selectedOption?.label ?? '')
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)

  const query = inputText.trim().toLowerCase()
  const filtered = open && inputText !== (selectedOption?.label ?? '')
    ? options.filter((option) => option.label.toLowerCase().includes(query))
    : options

  function openList() {
    setHighlightIndex(selectedOption ? options.indexOf(selectedOption) : options.length > 0 ? 0 : -1)
    setOpen(true)
  }

  function closeList() {
    setOpen(false)
    setHighlightIndex(-1)
    setInputText(selectedOption?.label ?? '')
  }

  function selectOption(option: ComboboxOption) {
    if (option.disabled) return
    if (value === undefined) setInternalValue(option.value)
    onValueChange?.(option.value)
    setInputText(option.label)
    setOpen(false)
    setHighlightIndex(-1)
  }

  function moveHighlight(step: 1 | -1) {
    if (filtered.length === 0) return
    let next = highlightIndex
    for (let attempts = 0; attempts < filtered.length; attempts += 1) {
      next = (next + step + filtered.length) % filtered.length
      if (!filtered[next]?.disabled) break
    }
    setHighlightIndex(next)
    listRef.current
      ?.querySelector(`[id="${optionId(listboxId, next)}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) openList()
      else moveHighlight(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) openList()
      else moveHighlight(-1)
    } else if (event.key === 'Enter') {
      if (open && highlightIndex >= 0 && filtered[highlightIndex]) {
        event.preventDefault()
        selectOption(filtered[highlightIndex])
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      closeList()
    }
  }

  return (
    <div className={cn('teal-u-grid teal-u-gap-1.5', className)}>
      {showLabel ? (
        <label htmlFor={semantics.controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) openList()
          else closeList()
        }}
      >
        <PopoverPrimitive.Anchor asChild>
          <div className="teal-u-relative">
            <Input
              ref={ref}
              id={semantics.controlId}
              role="combobox"
              aria-label={ariaLabel}
              aria-expanded={open}
              aria-controls={listboxId}
              aria-activedescendant={open && highlightIndex >= 0 ? optionId(listboxId, highlightIndex) : undefined}
              aria-autocomplete="list"
              aria-describedby={mergeDescriptionIds(describedBy, showDescription ? semantics.descriptionId : undefined)}
              aria-invalid={invalid}
              autoComplete="off"
              required={required}
              disabled={disabled}
              placeholder={placeholder}
              value={inputText}
              className="teal-u-pr-9"
              onFocus={() => {
                if (!open) openList()
              }}
              onChange={(event) => {
                setInputText(event.target.value)
                setHighlightIndex(0)
                if (!open) setOpen(true)
              }}
              onKeyDown={handleKeyDown}
            />
            <ChevronDown
              aria-hidden="true"
              className="teal-u-pointer-events-none teal-u-absolute teal-u-right-3 teal-u-top-1/2 teal-u-size-[var(--teal-icon-sm)] teal-u--translate-y-1/2 teal-u-text-on-surface-variant"
            />
          </div>
        </PopoverPrimitive.Anchor>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            side="bottom"
            sideOffset={6}
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-max-h-64 teal-u-w-[var(--radix-popover-trigger-width)] teal-u-overflow-y-auto teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface teal-u-outline-none"
          >
            <div ref={listRef} role="listbox" id={listboxId} aria-label={ariaLabel}>
              {filtered.length === 0 ? (
                <div className="teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface-variant">{emptyMessage}</div>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = option.value === selectedValue
                  const isHighlighted = index === highlightIndex
                  return (
                    <div
                      key={option.value}
                      id={optionId(listboxId, index)}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      data-highlighted={isHighlighted || undefined}
                      className="teal-u-relative teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-py-2 teal-u-pl-8 teal-u-pr-3 teal-u-text-sm teal-u-text-on-surface aria-[disabled=true]:teal-u-pointer-events-none aria-[disabled=true]:teal-u-opacity-45 data-[highlighted]:teal-u-bg-primary/10 data-[highlighted]:teal-u-text-primary"
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => {
                        if (!option.disabled) setHighlightIndex(index)
                      }}
                      onClick={() => selectOption(option)}
                    >
                      <span className="teal-u-absolute teal-u-left-2 teal-u-flex teal-u-size-[var(--teal-icon-sm)] teal-u-items-center teal-u-justify-center">
                        {isSelected ? <Check aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" /> : null}
                      </span>
                      {option.label}
                    </div>
                  )
                })
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {showDescription ? (
        <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  )
})
