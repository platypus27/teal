import { forwardRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from './cn'
import { fieldVariants } from './Input'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface MultiSelectOption {
  /** Prevents the option from being toggled. */
  disabled?: boolean
  /** Visible label of the option; also used for filtering. */
  label: string
  /** Value reported while the option is selected. */
  value: string
}

export interface MultiSelectProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the control invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  className?: string
  /** Initial selected values when uncontrolled. */
  defaultValue?: string[]
  /** Supporting text rendered below the control. */
  description?: ReactNode
  /** Prevents interaction with the control. */
  disabled?: boolean
  /** Visible label rendered above the control. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Called with the full list of selected values whenever it changes. */
  onValueChange?: (values: string[]) => void
  /** Options rendered in the popover listbox. */
  options: MultiSelectOption[]
  /** Text shown when nothing is selected. */
  placeholder?: string
  /** Marks the control as required. */
  required?: boolean
  /** Controlled selected values. */
  value?: string[]
}

const chipClasses =
  'teal-u-inline-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-primary/30 teal-u-bg-primary/10 teal-u-px-2 teal-u-py-0.5 teal-u-text-xs teal-u-font-semibold teal-u-text-primary'

/**
 * Multi-value select: selected options render as removable pills inside the
 * control, and a filterable multi-select listbox toggles options without closing.
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-invalid': invalid,
    className,
    defaultValue,
    description,
    disabled = false,
    id,
    label,
    onValueChange,
    options,
    placeholder = 'Select…',
    required,
    value,
  },
  ref,
) {
  const semantics = useFormSemantics({
    description,
    id,
    invalid: isAriaTrue(invalid),
    prefix: 'teal-multi-select',
    required,
  })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const listboxId = `${semantics.controlId}-listbox`
  const labelId = `${semantics.controlId}-label`

  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? [])
  const selectedValues = value !== undefined ? value : internalValue
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const normalized = query.trim().toLowerCase()
  const filtered = normalized
    ? options.filter((option) => option.label.toLowerCase().includes(normalized))
    : options
  const selectedOptions = selectedValues
    .map((selected) => options.find((option) => option.value === selected))
    .filter((option): option is MultiSelectOption => option !== undefined)

  function commit(next: string[]) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function toggleOption(option: MultiSelectOption) {
    if (option.disabled) return
    commit(
      selectedValues.includes(option.value)
        ? selectedValues.filter((selected) => selected !== option.value)
        : [...selectedValues, option.value],
    )
  }

  function handleControlKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled || open) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div className={cn('teal-u-grid teal-u-gap-1.5', className)}>
      {showLabel ? (
        <label id={labelId} htmlFor={semantics.controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled) return
          setOpen(nextOpen)
          if (!nextOpen) setQuery('')
        }}
      >
        <PopoverPrimitive.Anchor asChild>
          <div className="teal-u-relative">
            <div
              ref={ref}
              role="combobox"
              id={semantics.controlId}
              tabIndex={disabled ? -1 : 0}
              aria-expanded={open}
              aria-controls={listboxId}
              aria-haspopup="listbox"
              aria-labelledby={showLabel ? labelId : undefined}
              aria-label={ariaLabel}
              aria-describedby={mergeDescriptionIds(describedBy, showDescription ? semantics.descriptionId : undefined)}
              aria-invalid={invalid}
              aria-disabled={disabled || undefined}
              className={cn(
                fieldVariants(),
                'teal-u-flex teal-u-flex-wrap teal-u-items-center teal-u-gap-1.5 teal-u-py-1.5 teal-u-pr-9',
                disabled
                  ? 'teal-u-cursor-not-allowed teal-u-bg-surface-container-high teal-u-opacity-55'
                  : 'teal-u-cursor-pointer',
              )}
              onClick={() => {
                if (!disabled && !open) setOpen(true)
              }}
              onKeyDown={handleControlKeyDown}
            >
              {selectedOptions.length === 0 ? (
                <span className="teal-u-text-on-surface-variant">{placeholder}</span>
              ) : (
                selectedOptions.map((option) => (
                  <span key={option.value} className={chipClasses}>
                    {option.label}
                    <button
                      type="button"
                      aria-label={`Remove ${option.label}`}
                      disabled={disabled}
                      onClick={(event) => {
                        event.stopPropagation()
                        commit(selectedValues.filter((selected) => selected !== option.value))
                      }}
                      onKeyDown={(event) => event.stopPropagation()}
                      className="teal-focus-ring teal-u-inline-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-current hover:teal-u-bg-primary/20 disabled:teal-u-pointer-events-none"
                    >
                      <X aria-hidden="true" className="teal-u-size-3" strokeWidth={2.5} />
                    </button>
                  </span>
                ))
              )}
            </div>
            <ChevronDown
              aria-hidden="true"
              className="teal-u-pointer-events-none teal-u-absolute teal-u-right-3 teal-u-top-3.5 teal-u-size-[var(--teal-icon-sm)] teal-u-text-on-surface-variant"
            />
          </div>
        </PopoverPrimitive.Anchor>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            side="bottom"
            sideOffset={6}
            className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-w-[var(--radix-popover-trigger-width)] teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface teal-u-outline-none"
          >
            <div className="teal-u-p-1">
              <input
                value={query}
                placeholder="Filter…"
                aria-label="Filter options"
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setQuery(event.target.value)}
                className="teal-focus-ring teal-u-h-8 teal-u-w-full teal-u-rounded-lg teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-px-2.5 teal-u-text-sm teal-u-text-on-surface placeholder:teal-u-text-on-surface-variant focus-visible:teal-u-border-primary teal-u-outline-none"
              />
            </div>
            <div role="listbox" id={listboxId} aria-multiselectable="true" aria-label={ariaLabel} className="teal-u-max-h-60 teal-u-overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface-variant">No matches</div>
              ) : (
                filtered.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      className="teal-u-relative teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-py-2 teal-u-pl-8 teal-u-pr-3 teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high aria-[disabled=true]:teal-u-pointer-events-none aria-[disabled=true]:teal-u-opacity-45 aria-[selected=true]:teal-u-text-primary"
                      onClick={() => toggleOption(option)}
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
