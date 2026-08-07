import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from './cn'
import { fieldVariants } from './Input'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface CascaderOption {
  /** Child options shown in the next column when this option is active. */
  children?: CascaderOption[]
  /** Prevents the option from being selected or expanded. */
  disabled?: boolean
  /** Visible label of the option. */
  label: string
  /** Value emitted for this segment of the selected path. */
  value: string
}

export interface CascaderProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the control invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  className?: string
  /** Initial selected path when uncontrolled. */
  defaultValue?: string[]
  /** Supporting text rendered below the control. */
  description?: ReactNode
  /** Prevents interaction with the control. */
  disabled?: boolean
  /** Visible label rendered above the control. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Called with the full path of values whenever a leaf option is chosen. */
  onValueChange?: (path: string[]) => void
  /** Options rendered as cascading columns in the popover. */
  options: CascaderOption[]
  /** Text shown when nothing is selected. */
  placeholder?: string
  /** Marks the control as required. */
  required?: boolean
  /** Controlled selected path, one value per level. */
  value?: string[]
}

function isBranch(option: CascaderOption) {
  return (option.children?.length ?? 0) > 0
}

function optionKey(depth: number, value: string) {
  return `${depth}:${value}`
}

function firstEnabled(options: CascaderOption[]) {
  return options.find((option) => !option.disabled)
}

/**
 * Multi-level option picker: the popover renders one column per level, and
 * choosing a leaf commits the full path of values from root to leaf.
 */
export const Cascader = forwardRef<HTMLDivElement, CascaderProps>(function Cascader(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    'aria-label': ariaLabel,
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
  const semantics = useFormSemantics({ description, id, invalid: isAriaTrue(invalid), prefix: 'teal-cascader', required })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const labelId = `${semantics.controlId}-label`
  const listboxId = `${semantics.controlId}-listbox`

  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? [])
  const selectedPath = value !== undefined ? value : internalValue
  const [open, setOpen] = useState(false)
  const [activePath, setActivePath] = useState<string[]>([])

  const triggerRef = useRef<HTMLDivElement | null>(null)
  const optionRefs = useRef(new Map<string, HTMLDivElement>())
  const pendingFocus = useRef<string | null>(null)

  useEffect(() => {
    const key = pendingFocus.current
    if (key === null) return
    pendingFocus.current = null
    // Radix moves focus into the popover content on keyboard open; defer so the
    // roving focus lands after that effect has run.
    setTimeout(() => {
      optionRefs.current.get(key)?.focus()
    }, 0)
  })

  // Each active branch contributes its children as the next column.
  const columns: CascaderOption[][] = [options]
  let columnOptions = options
  for (const segment of activePath) {
    const branch = columnOptions.find((option) => option.value === segment)
    if (!branch || !isBranch(branch)) break
    columns.push(branch.children ?? [])
    columnOptions = branch.children ?? []
  }

  const selectedLabels: string[] = []
  let labelOptions = options
  for (const segment of selectedPath) {
    const option = labelOptions.find((candidate) => candidate.value === segment)
    if (!option) break
    selectedLabels.push(option.label)
    labelOptions = option.children ?? []
  }

  function commit(path: string[]) {
    if (value === undefined) setInternalValue(path)
    onValueChange?.(path)
  }

  function setTriggerRefs(node: HTMLDivElement | null) {
    triggerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  function closePopover() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  function openPopover() {
    if (disabled) return
    const first = firstEnabled(options)
    const initial = selectedPath.length > 0 ? selectedPath : first ? [first.value] : []
    setActivePath(initial)
    const last = initial[initial.length - 1]
    if (last !== undefined) pendingFocus.current = optionKey(initial.length - 1, last)
    setOpen(true)
  }

  function selectPath(depth: number, option: CascaderOption) {
    commit([...activePath.slice(0, depth), option.value])
    setOpen(false)
    triggerRef.current?.focus()
  }

  function expandBranch(depth: number, option: CascaderOption) {
    const first = firstEnabled(option.children ?? [])
    setActivePath(first ? [...activePath.slice(0, depth), option.value, first.value] : [...activePath.slice(0, depth), option.value])
    if (first) pendingFocus.current = optionKey(depth + 1, first.value)
  }

  function handleControlKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled || open) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      openPopover()
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLDivElement>, depth: number, option: CascaderOption) {
    const column = columns[depth] ?? []
    const index = column.findIndex((candidate) => candidate.value === option.value)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      let nextIndex = index + delta
      while (nextIndex >= 0 && nextIndex < column.length && column[nextIndex]?.disabled) nextIndex += delta
      const next = column[nextIndex]
      if (!next) return
      setActivePath([...activePath.slice(0, depth), next.value])
      pendingFocus.current = optionKey(depth, next.value)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (isBranch(option) && !option.disabled) expandBranch(depth, option)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (depth === 0) return
      const parentValue = activePath[depth - 1]
      if (parentValue === undefined) return
      setActivePath(activePath.slice(0, depth))
      pendingFocus.current = optionKey(depth - 1, parentValue)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (option.disabled) return
      if (isBranch(option)) expandBranch(depth, option)
      else selectPath(depth, option)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closePopover()
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
        }}
      >
        <PopoverPrimitive.Anchor asChild>
          <div className="teal-u-relative">
            <div
              ref={setTriggerRefs}
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
                'teal-u-flex teal-u-items-center teal-u-pr-9',
                disabled ? 'teal-u-cursor-not-allowed teal-u-bg-surface-container-high teal-u-opacity-55' : 'teal-u-cursor-pointer',
              )}
              onClick={() => {
                if (!open) openPopover()
              }}
              onKeyDown={handleControlKeyDown}
            >
              {selectedLabels.length === 0 ? (
                <span className="teal-u-text-on-surface-variant">{placeholder}</span>
              ) : (
                <span className="teal-u-truncate">{selectedLabels.join(' / ')}</span>
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
            className="teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface teal-u-outline-none"
          >
            <div className="teal-u-flex">
              {columns.map((column, depth) => (
                <div
                  key={depth}
                  role="listbox"
                  id={depth === 0 ? listboxId : undefined}
                  aria-label={`Level ${depth + 1}`}
                  className={cn(
                    'teal-u-flex teal-u-max-h-60 teal-u-w-44 teal-u-flex-col teal-u-overflow-y-auto teal-u-p-0.5',
                    depth > 0 && 'teal-u-border-0 teal-u-border-l teal-u-border-solid teal-u-border-outline-variant/30',
                  )}
                >
                  {column.map((option) => {
                    const isSelected = selectedPath[depth] === option.value
                    const isActive = activePath[depth] === option.value
                    return (
                      <div
                        key={option.value}
                        ref={(node) => {
                          if (node) optionRefs.current.set(optionKey(depth, option.value), node)
                          else optionRefs.current.delete(optionKey(depth, option.value))
                        }}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled || undefined}
                        tabIndex={-1}
                        className={cn(
                          'teal-focus-ring teal-u-relative teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-py-2 teal-u-pl-3 teal-u-pr-8 teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high aria-[disabled=true]:teal-u-pointer-events-none aria-[disabled=true]:teal-u-opacity-45',
                          isActive && 'teal-u-bg-surface-container-high',
                          isSelected && 'teal-u-font-semibold teal-u-text-primary',
                        )}
                        onClick={() => {
                          if (option.disabled) return
                          if (isBranch(option)) expandBranch(depth, option)
                          else selectPath(depth, option)
                        }}
                        onKeyDown={(event) => handleOptionKeyDown(event, depth, option)}
                      >
                        <span className="teal-u-truncate">{option.label}</span>
                        {isBranch(option) ? (
                          <ChevronRight
                            aria-hidden="true"
                            className="teal-u-absolute teal-u-right-2 teal-u-size-[var(--teal-icon-sm)] teal-u-text-on-surface-variant"
                          />
                        ) : null}
                        {!isBranch(option) && isSelected ? (
                          <Check aria-hidden="true" className="teal-u-absolute teal-u-right-2 teal-u-size-[var(--teal-icon-sm)]" />
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              ))}
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
