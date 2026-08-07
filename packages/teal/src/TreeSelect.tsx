import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from './cn'
import { fieldVariants } from './Input'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

export interface TreeSelectNode {
  /** Nested nodes rendered when this branch is expanded. */
  children?: TreeSelectNode[]
  /** Prevents the node from being selected or expanded. */
  disabled?: boolean
  /** Visible label of the node; also used for typeahead. */
  label: string
  /** Value reported when the node is selected. */
  value: string
}

export interface TreeSelectProps {
  'aria-describedby'?: string
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  /** Marks the control invalid for form validation and screen readers. */
  'aria-invalid'?: boolean | 'false' | 'true'
  /** Explicit id; otherwise Field or an internal id is used. */
  id?: string
  className?: string
  /** Initially expanded branch values when uncontrolled. */
  defaultExpandedValues?: string[]
  /** Initial selected value when uncontrolled. */
  defaultValue?: string
  /** Supporting text rendered below the control. */
  description?: ReactNode
  /** Prevents interaction with the control. */
  disabled?: boolean
  /** Visible label rendered above the control. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Called with the value of the chosen leaf node. */
  onValueChange?: (value: string) => void
  /** Tree of options rendered in the popover; only leaf nodes are selectable. */
  options: TreeSelectNode[]
  /** Text shown when nothing is selected. */
  placeholder?: string
  /** Marks the control as required. */
  required?: boolean
  /** Controlled selected value. */
  value?: string
}

interface FlatNode {
  depth: number
  disabled: boolean
  hasChildren: boolean
  label: string
  parentValue: string | undefined
  value: string
}

function isBranch(node: TreeSelectNode) {
  return (node.children?.length ?? 0) > 0
}

function findNode(nodes: TreeSelectNode[], value: string): TreeSelectNode | undefined {
  for (const node of nodes) {
    if (node.value === value) return node
    const child = findNode(node.children ?? [], value)
    if (child) return child
  }
  return undefined
}

/** Collects the ancestor values of a node so it can be revealed on open. */
function ancestorValues(nodes: TreeSelectNode[], value: string, trail: string[] = []): string[] | undefined {
  for (const node of nodes) {
    if (node.value === value) return trail
    const found = ancestorValues(node.children ?? [], value, [...trail, node.value])
    if (found) return found
  }
  return undefined
}

/**
 * Single-select control whose popover shows an expandable tree of options.
 * Branch nodes expand and collapse; leaf nodes commit the selection.
 */
export const TreeSelect = forwardRef<HTMLDivElement, TreeSelectProps>(function TreeSelect(
  {
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    'aria-label': ariaLabel,
    className,
    defaultExpandedValues,
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
  const semantics = useFormSemantics({ description, id, invalid: isAriaTrue(invalid), prefix: 'teal-tree-select', required })
  const showLabel = hasFormContent(label) && !semantics.labeledByField
  const showDescription = hasFormContent(description)
  const labelId = `${semantics.controlId}-label`
  const treeId = `${semantics.controlId}-tree`

  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)
  const selectedValue = value !== undefined ? value : internalValue
  const [open, setOpen] = useState(false)
  const [expandedValues, setExpandedValues] = useState<string[]>(defaultExpandedValues ?? [])
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined)

  const triggerRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = useRef<string | null>(null)
  const typeahead = useRef('')
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const pending = pendingFocus.current
    if (pending === null) return
    pendingFocus.current = null
    // Radix moves focus into the popover content on keyboard open; defer so the
    // roving focus lands after that effect has run.
    setTimeout(() => {
      nodeRefs.current.get(pending)?.focus()
    }, 0)
  })

  const expandedSet = new Set(expandedValues)

  // Flatten the visible nodes in render order for keyboard navigation and typeahead.
  const visible: FlatNode[] = []
  const walk = (nodes: TreeSelectNode[], depth: number, parentValue: string | undefined) => {
    for (const node of nodes) {
      const hasChildren = isBranch(node)
      visible.push({ depth, disabled: node.disabled ?? false, hasChildren, label: node.label, parentValue, value: node.value })
      if (hasChildren && expandedSet.has(node.value)) walk(node.children ?? [], depth + 1, node.value)
    }
  }
  walk(options, 0, undefined)

  const selectedNode = selectedValue !== undefined ? findNode(options, selectedValue) : undefined

  function commit(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function setTriggerRefs(node: HTMLDivElement | null) {
    triggerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  function focusNode(nodeValue: string) {
    setActiveValue(nodeValue)
    pendingFocus.current = nodeValue
  }

  function closePopover() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  function openPopover() {
    if (disabled) return
    if (selectedValue !== undefined) {
      const ancestors = ancestorValues(options, selectedValue)
      if (ancestors) setExpandedValues((current) => Array.from(new Set([...current, ...ancestors])))
    }
    const initial = selectedValue ?? visible[0]?.value
    if (initial !== undefined) focusNode(initial)
    setOpen(true)
  }

  function toggleExpanded(nodeValue: string) {
    setExpandedValues((current) => (current.includes(nodeValue) ? current.filter((entry) => entry !== nodeValue) : [...current, nodeValue]))
  }

  function selectNode(nodeValue: string) {
    commit(nodeValue)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function choose(entry: FlatNode) {
    if (entry.disabled) return
    setActiveValue(entry.value)
    if (entry.hasChildren) toggleExpanded(entry.value)
    else selectNode(entry.value)
  }

  function handleTypeahead(char: string) {
    typeahead.current += char.toLowerCase()
    clearTimeout(typeaheadTimer.current)
    typeaheadTimer.current = setTimeout(() => {
      typeahead.current = ''
    }, 500)
    const buffer = typeahead.current
    const startIndex = Math.max(0, visible.findIndex((node) => node.value === activeValue))
    const ordered = [...visible.slice(startIndex + 1), ...visible.slice(0, startIndex + 1)]
    const match = ordered.find((node) => !node.disabled && node.label.toLowerCase().startsWith(buffer))
    if (match) focusNode(match.value)
  }

  function handleControlKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled || open) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      openPopover()
    }
  }

  function handleNodeKeyDown(event: KeyboardEvent<HTMLButtonElement>, entry: FlatNode) {
    const index = visible.findIndex((candidate) => candidate.value === entry.value)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = visible[index + 1]
      if (next) focusNode(next.value)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const next = visible[index - 1]
      if (next) focusNode(next.value)
    } else if (event.key === 'Home') {
      event.preventDefault()
      if (visible[0]) focusNode(visible[0].value)
    } else if (event.key === 'End') {
      event.preventDefault()
      const last = visible[visible.length - 1]
      if (last) focusNode(last.value)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (!entry.hasChildren) return
      if (!expandedSet.has(entry.value)) toggleExpanded(entry.value)
      else {
        const child = visible[index + 1]
        if (child) focusNode(child.value)
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (entry.hasChildren && expandedSet.has(entry.value)) toggleExpanded(entry.value)
      else if (entry.parentValue !== undefined) focusNode(entry.parentValue)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(entry)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closePopover()
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      handleTypeahead(event.key)
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
              aria-controls={treeId}
              aria-haspopup="tree"
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
              {selectedNode ? (
                <span className="teal-u-truncate">{selectedNode.label}</span>
              ) : (
                <span className="teal-u-text-on-surface-variant">{placeholder}</span>
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
            <ul role="tree" id={treeId} aria-label={ariaLabel} aria-labelledby={showLabel ? labelId : undefined} className="teal-u-max-h-60 teal-u-overflow-y-auto">
              {options.map((node) => renderNode(node, 0, undefined))}
            </ul>
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

  function renderNode(node: TreeSelectNode, depth: number, parentValue: string | undefined): ReactNode {
    const hasChildren = isBranch(node)
    const isExpanded = hasChildren && expandedSet.has(node.value)
    const isSelected = node.value === selectedValue
    const entry: FlatNode = {
      depth,
      disabled: node.disabled ?? false,
      hasChildren,
      label: node.label,
      parentValue,
      value: node.value,
    }
    return (
      <li key={node.value} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
        <button
          ref={(node_) => {
            if (node_) nodeRefs.current.set(node.value, node_)
            else nodeRefs.current.delete(node.value)
          }}
          type="button"
          tabIndex={-1}
          disabled={node.disabled}
          style={{ paddingLeft: `${0.5 + depth * 1.25}rem` }}
          className={cn(
            'teal-focus-ring teal-u-flex teal-u-w-full teal-u-items-center teal-u-gap-1 teal-u-rounded-lg teal-u-px-2 teal-u-py-1.5 teal-u-text-left teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-45',
            isSelected && 'teal-u-bg-primary/10 teal-u-font-semibold teal-u-text-primary hover:teal-u-bg-primary/10',
          )}
          onClick={() => choose(entry)}
          onKeyDown={(event) => handleNodeKeyDown(event, entry)}
        >
          {hasChildren ? (
            <ChevronRight
              aria-hidden="true"
              className={cn(
                'teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0 teal-u-text-on-surface-variant teal-u-transition-transform teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
                isExpanded && 'teal-u-rotate-90',
              )}
            />
          ) : (
            <span aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0" />
          )}
          <span className="teal-u-truncate">{node.label}</span>
          {isSelected ? <Check aria-hidden="true" className="teal-u-ml-auto teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0" /> : null}
        </button>
        {isExpanded ? <ul role="group">{node.children?.map((child) => renderNode(child, depth + 1, node.value))}</ul> : null}
      </li>
    )
  }
})
