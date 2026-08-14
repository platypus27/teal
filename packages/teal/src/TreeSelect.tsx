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
  /** Initial selection when uncontrolled: a leaf value in tree display, a path of values in columns display. */
  defaultValue?: string | string[]
  /** Supporting text rendered below the control. */
  description?: ReactNode
  /** Prevents interaction with the control. */
  disabled?: boolean
  /** Popover layout: an expandable tree, or one column per level. */
  display?: 'tree' | 'columns'
  /** Visible label rendered above the control. Required outside a Field; inside a Field the Field's label is used. */
  label?: ReactNode
  /** Called with the chosen leaf value (tree display) or the full path from root to leaf (columns display). */
  onValueChange?: (value: string | string[]) => void
  /** Tree of options rendered in the popover; only leaf nodes are selectable. */
  options: TreeSelectNode[]
  /** Text shown when nothing is selected. */
  placeholder?: string
  /** Marks the control as required. */
  required?: boolean
  /** Controlled selection: a leaf value in tree display, a path of values in columns display. */
  value?: string | string[]
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

function optionKey(depth: number, value: string) {
  return `${depth}:${value}`
}

function firstEnabled(nodes: TreeSelectNode[]) {
  return nodes.find((node) => !node.disabled)
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
 * Single-select control whose popover shows an expandable tree of options, or —
 * with display="columns" — one column per level. Branch nodes expand; leaf nodes
 * commit a single value in tree display, the full path in columns display.
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
    display = 'tree',
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
  const listboxId = `${semantics.controlId}-listbox`

  const [internalValue, setInternalValue] = useState<string | string[] | undefined>(defaultValue)
  const selectedValue = value !== undefined ? value : internalValue
  const selectedTreeValue = typeof selectedValue === 'string' ? selectedValue : undefined
  const selectedPath = Array.isArray(selectedValue) ? selectedValue : []
  const [open, setOpen] = useState(false)
  const [expandedValues, setExpandedValues] = useState<string[]>(defaultExpandedValues ?? [])
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined)
  const [activePath, setActivePath] = useState<string[]>([])

  const triggerRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>())
  const optionRefs = useRef(new Map<string, HTMLDivElement>())
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
      const target = nodeRefs.current.get(pending) ?? optionRefs.current.get(pending)
      target?.focus()
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

  const selectedNode = selectedTreeValue !== undefined ? findNode(options, selectedTreeValue) : undefined

  // Columns display: each active branch contributes its children as the next column.
  const columns: TreeSelectNode[][] = [options]
  let columnOptions = options
  for (const segment of activePath) {
    const branch = columnOptions.find((node) => node.value === segment)
    if (!branch || !isBranch(branch)) break
    columns.push(branch.children ?? [])
    columnOptions = branch.children ?? []
  }

  const selectedLabels: string[] = []
  let labelOptions = options
  for (const segment of selectedPath) {
    const node = labelOptions.find((candidate) => candidate.value === segment)
    if (!node) break
    selectedLabels.push(node.label)
    labelOptions = node.children ?? []
  }

  function commit(next: string | string[]) {
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
    if (display === 'columns') {
      setActivePath(selectedPath)
      if (selectedPath.length > 0) {
        const last = selectedPath[selectedPath.length - 1]
        if (last !== undefined) focusOption(selectedPath.length - 1, last)
      } else {
        const first = firstEnabled(options)
        if (first) focusOption(0, first.value)
      }
      setOpen(true)
      return
    }
    if (selectedTreeValue !== undefined) {
      const ancestors = ancestorValues(options, selectedTreeValue)
      if (ancestors) setExpandedValues((current) => Array.from(new Set([...current, ...ancestors])))
    }
    const initial = selectedTreeValue ?? visible[0]?.value
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

  function selectPath(depth: number, node: TreeSelectNode) {
    commit([...activePath.slice(0, depth), node.value])
    setOpen(false)
    triggerRef.current?.focus()
  }

  function expandBranch(depth: number, node: TreeSelectNode) {
    const first = firstEnabled(node.children ?? [])
    setActivePath(first ? [...activePath.slice(0, depth), node.value, first.value] : [...activePath.slice(0, depth), node.value])
    if (first) focusOption(depth + 1, first.value)
  }

  // Focuses an already-rendered column option synchronously; targets that only
  // appear after the next commit (popover open, expanded branch) are deferred
  // through pendingFocus so they land after Radix has moved focus.
  function focusOption(depth: number, value: string) {
    const key = optionKey(depth, value)
    const element = optionRefs.current.get(key)
    if (element) element.focus()
    else pendingFocus.current = key
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

  function handleOptionKeyDown(event: KeyboardEvent<HTMLDivElement>, depth: number, node: TreeSelectNode) {
    const column = columns[depth] ?? []
    const index = column.findIndex((candidate) => candidate.value === node.value)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      let nextIndex = index + delta
      while (nextIndex >= 0 && nextIndex < column.length && column[nextIndex]?.disabled) nextIndex += delta
      const next = column[nextIndex]
      if (!next) return
      setActivePath([...activePath.slice(0, depth), next.value])
      focusOption(depth, next.value)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (isBranch(node) && !node.disabled) expandBranch(depth, node)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (depth === 0) return
      const parentValue = activePath[depth - 1]
      if (parentValue === undefined) return
      setActivePath(activePath.slice(0, depth))
      focusOption(depth - 1, parentValue)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (node.disabled) return
      if (isBranch(node)) expandBranch(depth, node)
      else selectPath(depth, node)
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
              aria-controls={display === 'columns' ? listboxId : treeId}
              aria-haspopup={display === 'columns' ? 'listbox' : 'tree'}
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
              {display === 'columns' ? (
                selectedLabels.length === 0 ? (
                  <span className="teal-u-text-on-surface-variant">{placeholder}</span>
                ) : (
                  <span className="teal-u-truncate">{selectedLabels.join(' / ')}</span>
                )
              ) : selectedNode ? (
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
            className={cn(
              'teal-popper-content teal-overlay-surface teal-u-z-[var(--teal-z-popover)] teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface teal-u-outline-none',
              display === 'tree' && 'teal-u-w-[var(--radix-popover-trigger-width)]',
            )}
          >
            {display === 'columns' ? (
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
                    {column.map((node) => {
                      const isSelected = selectedPath[depth] === node.value
                      const isActive = activePath[depth] === node.value
                      return (
                        <div
                          key={node.value}
                          ref={(element) => {
                            if (element) optionRefs.current.set(optionKey(depth, node.value), element)
                            else optionRefs.current.delete(optionKey(depth, node.value))
                          }}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={node.disabled || undefined}
                          tabIndex={-1}
                          className={cn(
                            'teal-focus-ring teal-u-relative teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-py-2 teal-u-pl-3 teal-u-pr-8 teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high aria-[disabled=true]:teal-u-pointer-events-none aria-[disabled=true]:teal-u-opacity-45',
                            isActive && 'teal-u-bg-surface-container-high',
                            isSelected && 'teal-u-font-semibold teal-u-text-primary',
                          )}
                          onClick={() => {
                            if (node.disabled) return
                            if (isBranch(node)) expandBranch(depth, node)
                            else selectPath(depth, node)
                          }}
                          onKeyDown={(event) => handleOptionKeyDown(event, depth, node)}
                        >
                          <span className="teal-u-truncate">{node.label}</span>
                          {isBranch(node) ? (
                            <ChevronRight
                              aria-hidden="true"
                              className="teal-u-absolute teal-u-right-2 teal-u-size-[var(--teal-icon-sm)] teal-u-text-on-surface-variant"
                            />
                          ) : null}
                          {!isBranch(node) && isSelected ? (
                            <Check aria-hidden="true" className="teal-u-absolute teal-u-right-2 teal-u-size-[var(--teal-icon-sm)]" />
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <ul role="tree" id={treeId} aria-label={ariaLabel} aria-labelledby={showLabel ? labelId : undefined} className="teal-u-max-h-60 teal-u-overflow-y-auto">
                {options.map((node) => renderNode(node, 0, undefined))}
              </ul>
            )}
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
    const isSelected = node.value === selectedTreeValue
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
