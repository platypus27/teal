import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from './cn'

export interface TreeGridColumn {
  /** Key read from each row object to render the cell. */
  key: string
  /** Visible column heading. */
  label: ReactNode
}

export interface TreeGridRow {
  /** Child rows shown when the row is expanded. */
  children?: TreeGridRow[]
  /** Stable, unique id for the row. */
  id: string
  /** Cell content keyed by column key. */
  [key: string]: unknown
}

export interface TreeGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible name for the grid. */
  'aria-label': string
  /** Column definitions; the first column carries the tree indentation and expand toggle. */
  columns: TreeGridColumn[]
  /** Initial expanded row ids when uncontrolled. */
  defaultExpandedIds?: string[]
  /** Controlled expanded row ids. */
  expandedIds?: string[]
  /** Called with the full list of expanded ids whenever expansion changes. */
  onExpandedChange?: (expandedIds: string[]) => void
  /** Rows rendered at the root of the tree. */
  rows: TreeGridRow[]
}

interface FlatRow {
  depth: number
  hasChildren: boolean
  id: string
  parentId: string | undefined
  row: TreeGridRow
}

/** A table with expandable tree rows following the WAI-ARIA treegrid pattern. */
export const TreeGrid = forwardRef<HTMLDivElement, TreeGridProps>(function TreeGrid(
  { 'aria-label': ariaLabel, className, columns, defaultExpandedIds, expandedIds, onExpandedChange, rows, ...props },
  ref,
) {
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpandedIds ?? [])
  const effectiveExpanded = expandedIds ?? internalExpanded
  const expandedSet = new Set(effectiveExpanded)

  const [activeId, setActiveId] = useState<string | undefined>(undefined)
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>())

  // Flatten the visible rows in render order for keyboard navigation and parent lookup.
  const visible: FlatRow[] = []
  const walk = (nodes: TreeGridRow[], depth: number, parentId: string | undefined) => {
    for (const row of nodes) {
      const hasChildren = (row.children?.length ?? 0) > 0
      visible.push({ depth, hasChildren, id: row.id, parentId, row })
      if (hasChildren && expandedSet.has(row.id)) walk(row.children ?? [], depth + 1, row.id)
    }
  }
  walk(rows, 0, undefined)

  const tabbableId = visible.some((entry) => entry.id === activeId) ? activeId : visible[0]?.id

  function setExpanded(next: string[]) {
    if (expandedIds === undefined) setInternalExpanded(next)
    onExpandedChange?.(next)
  }

  function toggleExpanded(id: string) {
    setExpanded(expandedSet.has(id) ? effectiveExpanded.filter((entry) => entry !== id) : [...effectiveExpanded, id])
  }

  function focusRow(id: string | undefined) {
    if (id === undefined) return
    setActiveId(id)
    rowRefs.current.get(id)?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>, entry: FlatRow) {
    const index = visible.findIndex((candidate) => candidate.id === entry.id)
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (entry.hasChildren && !expandedSet.has(entry.id)) setExpanded([...effectiveExpanded, entry.id])
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (entry.hasChildren && expandedSet.has(entry.id)) toggleExpanded(entry.id)
      else if (entry.parentId !== undefined) focusRow(entry.parentId)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusRow(visible[index + 1]?.id)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusRow(visible[index - 1]?.id)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusRow(visible[0]?.id)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusRow(visible[visible.length - 1]?.id)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'teal-raised-surface teal-u-overflow-x-auto teal-u-border teal-u-border-outline-variant/30 teal-u-bg-surface-container',
        className,
      )}
      {...props}
    >
      <table role="treegrid" aria-label={ariaLabel} className="teal-u-w-full teal-u-border-collapse teal-u-text-left teal-u-text-sm">
        <thead className="teal-u-bg-surface-container-highest teal-u-text-xs teal-u-font-semibold teal-u-uppercase teal-u-tracking-wide teal-u-text-on-surface-variant">
          <tr role="row">
            {columns.map((column) => (
              <th key={column.key} role="columnheader" scope="col" className="teal-u-px-4 teal-u-py-3">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="teal-u-divide-y teal-u-divide-outline-variant/40 teal-u-bg-surface">
          {visible.map((entry) => {
            const isExpanded = entry.hasChildren && expandedSet.has(entry.id)
            return (
              <tr
                key={entry.id}
                ref={(node) => {
                  if (node) rowRefs.current.set(entry.id, node)
                  else rowRefs.current.delete(entry.id)
                }}
                role="row"
                aria-expanded={entry.hasChildren ? isExpanded : undefined}
                aria-level={entry.depth + 1}
                tabIndex={entry.id === tabbableId ? 0 : -1}
                onKeyDown={(event) => handleKeyDown(event, entry)}
                onFocus={() => setActiveId(entry.id)}
                className="teal-focus-ring teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] hover:teal-u-bg-surface-container-high/70"
              >
                {columns.map((column, columnIndex) => (
                  <td key={column.key} role="gridcell" className="teal-u-px-4 teal-u-py-3 teal-u-text-on-surface">
                    {columnIndex === 0 ? (
                      <span
                        className="teal-u-flex teal-u-items-center teal-u-gap-1"
                        style={{ paddingLeft: `${entry.depth * 1.25}rem` }}
                      >
                        {entry.hasChildren ? (
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${
                              typeof entry.row[column.key] === 'string' ? (entry.row[column.key] as string) : 'row'
                            }`}
                            onClick={() => toggleExpanded(entry.id)}
                            className="teal-focus-ring teal-u-inline-flex teal-u-rounded-full teal-u-p-0.5 teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface"
                          >
                            <ChevronRight
                              aria-hidden="true"
                              className={cn(
                                'teal-u-size-[var(--teal-icon-sm)] teal-u-transition-transform teal-u-duration-[var(--teal-motion-fast)]',
                                isExpanded && 'teal-u-rotate-90',
                              )}
                            />
                          </button>
                        ) : (
                          <span aria-hidden="true" className="teal-u-inline-block teal-u-size-[calc(var(--teal-icon-sm)+0.25rem)]" />
                        )}
                        {entry.row[column.key] as ReactNode}
                      </span>
                    ) : (
                      (entry.row[column.key] as ReactNode)
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
})
