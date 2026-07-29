import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from './cn'

export interface TreeViewItem {
  /** Nested items rendered inside a `role="group"` when expanded. */
  children?: TreeViewItem[]
  /** Optional icon rendered before the label. */
  icon?: ReactNode
  /** Stable, unique id for the item. */
  id: string
  /** Visible label of the item. */
  label: ReactNode
}

export interface TreeViewProps {
  /** Accessible name for the tree. */
  'aria-label': string
  className?: string
  /** Initial expanded item ids when uncontrolled. */
  defaultExpandedIds?: string[]
  /** Controlled expanded item ids. */
  expandedIds?: string[]
  /** Items rendered at the root of the tree. */
  items: TreeViewItem[]
  /** Called with the full list of expanded ids whenever expansion changes. */
  onExpandedChange?: (expandedIds: string[]) => void
  /** Called with the id of the selected item. */
  onSelect?: (id: string) => void
  /** Currently selected item id. */
  selectedId?: string
}

interface FlatItem {
  depth: number
  hasChildren: boolean
  id: string
  parentId: string | undefined
}

/** A navigable tree with roving focus, expansion, and selection. */
export function TreeView({
  'aria-label': ariaLabel,
  className,
  defaultExpandedIds,
  expandedIds,
  items,
  onExpandedChange,
  onSelect,
  selectedId,
}: TreeViewProps) {
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpandedIds ?? [])
  const effectiveExpanded = expandedIds ?? internalExpanded
  const expandedSet = new Set(effectiveExpanded)

  const [activeId, setActiveId] = useState<string | undefined>(selectedId)
  const rowRefs = useRef(new Map<string, HTMLButtonElement>())

  // Flatten the visible items in render order for keyboard navigation and parent lookup.
  const visible: FlatItem[] = []
  const walk = (nodes: TreeViewItem[], depth: number, parentId: string | undefined) => {
    for (const node of nodes) {
      const hasChildren = (node.children?.length ?? 0) > 0
      visible.push({ depth, hasChildren, id: node.id, parentId })
      if (hasChildren && expandedSet.has(node.id)) walk(node.children ?? [], depth + 1, node.id)
    }
  }
  walk(items, 0, undefined)

  const tabbableId = visible.some((entry) => entry.id === activeId) ? activeId : visible[0]?.id

  function setExpanded(next: string[]) {
    if (expandedIds === undefined) setInternalExpanded(next)
    onExpandedChange?.(next)
  }

  function toggleExpanded(id: string) {
    setExpanded(expandedSet.has(id) ? effectiveExpanded.filter((entry) => entry !== id) : [...effectiveExpanded, id])
  }

  function focusItem(id: string | undefined) {
    if (id === undefined) return
    setActiveId(id)
    rowRefs.current.get(id)?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, entry: FlatItem) {
    const index = visible.findIndex((candidate) => candidate.id === entry.id)
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (entry.hasChildren && !expandedSet.has(entry.id)) setExpanded([...effectiveExpanded, entry.id])
      else if (entry.hasChildren) focusItem(visible[index + 1]?.id)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (entry.hasChildren && expandedSet.has(entry.id)) toggleExpanded(entry.id)
      else focusItem(entry.parentId)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusItem(visible[index + 1]?.id)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusItem(visible[index - 1]?.id)
    }
  }

  function renderItem(item: TreeViewItem, depth: number, parentId: string | undefined): ReactNode {
    const hasChildren = (item.children?.length ?? 0) > 0
    const isExpanded = hasChildren && expandedSet.has(item.id)
    const isSelected = item.id === selectedId
    const entry: FlatItem = { depth, hasChildren, id: item.id, parentId }
    return (
      <li key={item.id} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
        <button
          ref={(node) => {
            if (node) rowRefs.current.set(item.id, node)
            else rowRefs.current.delete(item.id)
          }}
          type="button"
          tabIndex={item.id === tabbableId ? 0 : -1}
          style={{ paddingLeft: `${0.5 + depth * 1.25}rem` }}
          className={cn(
            'teal-focus-ring teal-u-flex teal-u-w-full teal-u-items-center teal-u-gap-1 teal-u-rounded-lg teal-u-px-2 teal-u-py-1.5 teal-u-text-left teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high',
            isSelected && 'teal-u-bg-primary/10 teal-u-font-semibold teal-u-text-primary hover:teal-u-bg-primary/10',
          )}
          onClick={() => {
            setActiveId(item.id)
            if (hasChildren) toggleExpanded(item.id)
            onSelect?.(item.id)
          }}
          onKeyDown={(event) => handleKeyDown(event, entry)}
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
          {item.icon ? <span aria-hidden="true" className="teal-u-flex teal-u-shrink-0">{item.icon}</span> : null}
          <span className="teal-u-truncate">{item.label}</span>
        </button>
        {isExpanded ? (
          <ul role="group">{item.children?.map((child) => renderItem(child, depth + 1, item.id))}</ul>
        ) : null}
      </li>
    )
  }

  return (
    <ul role="tree" aria-label={ariaLabel} className={cn('teal-u-grid teal-u-gap-0.5', className)}>
      {items.map((item) => renderItem(item, 0, undefined))}
    </ul>
  )
}
