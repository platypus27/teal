import { forwardRef, type ReactElement, type ReactNode, type Ref } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Checkbox } from './Checkbox'
import { cn } from './cn'
import { Skeleton } from './LoadingState'
import type { TableColumn } from './Table'

export interface DataTableColumn<Row> extends TableColumn<Row> {
  /** Renders the header as a sort toggle button that reports through `onSortChange`. */
  sortable?: boolean
  /** Key reported to `onSortChange`; defaults to the column `key`. */
  sortKey?: string
}

export interface DataTableSort {
  direction: 'asc' | 'desc'
  key: string
}

export interface DataTableProps<Row> {
  /** Accessible caption describing the table, announced to screen readers. */
  caption: string
  className?: string
  /** Column definitions rendered in header order. */
  columns: Array<DataTableColumn<Row>>
  /** Vertical padding of cells. */
  density?: 'compact' | 'comfortable'
  /** Content shown when `rows` is empty and the table is not loading. */
  empty?: ReactNode
  /** Returns a stable, unique key for each row. */
  getRowKey: (row: Row) => string
  /** Renders skeleton rows in place of data and marks the region busy. */
  loading?: boolean
  /** Accessible label announced while skeleton rows are shown. */
  loadingLabel?: string
  /** Called with the next sort state when a sortable header is activated. Sorting itself stays caller-owned. */
  onSortChange?: (sort: DataTableSort) => void
  /** Called with the full list of selected row keys whenever the selection changes. */
  onSelectionChange?: (keys: string[]) => void
  /** Data rows rendered in the table body. */
  rows: Row[]
  /** Adds a selection column with a header checkbox and per-row checkboxes. */
  selectable?: boolean
  /** Controlled set of selected row keys. */
  selectedKeys?: Set<string> | string[]
  /** Controlled sort state; drives the header icons and `aria-sort`. */
  sort?: DataTableSort
}

function DataTableRender<Row>(
  {
    caption,
    className,
    columns,
    density = 'comfortable',
    empty = 'No results',
    getRowKey,
    loading = false,
    loadingLabel = 'Loading table data',
    onSortChange,
    onSelectionChange,
    rows,
    selectable = false,
    selectedKeys,
    sort,
  }: DataTableProps<Row>,
  ref: Ref<HTMLDivElement>,
) {
  const selectedSet = new Set(selectedKeys ?? [])
  const rowKeys = rows.map(getRowKey)
  const allSelected = rowKeys.length > 0 && rowKeys.every((key) => selectedSet.has(key))
  const someSelected = rowKeys.some((key) => selectedSet.has(key))
  const columnCount = selectable ? columns.length + 1 : columns.length
  const cellPadding = density === 'compact' ? 'teal-u-px-3 teal-u-py-2' : 'teal-u-px-4 teal-u-py-3'

  function handleSort(column: DataTableColumn<Row>) {
    const key = column.sortKey ?? column.key
    const direction: DataTableSort['direction'] = sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc'
    onSortChange?.({ direction, key })
  }

  function toggleAll() {
    onSelectionChange?.(allSelected ? [] : rowKeys)
  }

  function toggleRow(key: string) {
    const next = new Set(selectedSet)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onSelectionChange?.([...next])
  }

  return (
    <div
      ref={ref}
      role="region"
      aria-label={`${caption} table`}
      aria-busy={loading || undefined}
      className={cn(
        'teal-raised-surface teal-focus-ring teal-u-overflow-x-auto teal-u-border teal-u-bg-surface-container',
        className,
      )}
    >
      {loading ? (
        <span role="status" className="teal-u-sr-only">
          {loadingLabel}
        </span>
      ) : null}
      <table className="teal-u-w-full teal-u-border-collapse teal-u-text-left teal-u-text-sm">
        <caption className="teal-u-sr-only">{caption}</caption>
        <thead className="teal-u-bg-surface-container-highest teal-u-text-xs teal-u-font-semibold teal-u-uppercase teal-u-tracking-wide teal-u-text-on-surface-variant">
          <tr>
            {selectable ? (
              <th scope="col" className={cn(cellPadding, 'teal-u-w-10')}>
                <Checkbox
                  aria-label="Select all rows"
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={toggleAll}
                />
              </th>
            ) : null}
            {columns.map((column) => {
              const sortKey = column.sortKey ?? column.key
              const sorted = sort?.key === sortKey ? sort.direction : undefined
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                  className={cn(cellPadding, column.headerClassName)}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className="teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-gap-1 teal-u-rounded teal-u-font-semibold teal-u-uppercase teal-u-tracking-wide teal-u-text-inherit hover:teal-u-text-on-surface"
                    >
                      {column.header}
                      {sorted === 'asc' ? (
                        <ArrowUp aria-hidden="true" className="teal-u-size-[var(--teal-icon-xs)]" />
                      ) : sorted === 'desc' ? (
                        <ArrowDown aria-hidden="true" className="teal-u-size-[var(--teal-icon-xs)]" />
                      ) : (
                        <ArrowUpDown aria-hidden="true" className="teal-u-size-[var(--teal-icon-xs)] teal-u-opacity-60" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="teal-u-divide-y teal-u-divide-outline-variant/40 teal-u-bg-surface">
          {loading
            ? Array.from({ length: 3 }, (_, rowIndex) => (
                <tr key={`loading-${rowIndex}`}>
                  {selectable ? (
                    <td className={cellPadding}>
                      <Skeleton className="teal-u-size-4" />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td key={column.key} className={cellPadding}>
                      <Skeleton className="teal-u-h-4 teal-u-w-4/5" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => {
                const rowKey = getRowKey(row)
                const selected = selectedSet.has(rowKey)
                return (
                  <tr
                    key={rowKey}
                    aria-selected={selectable ? selected : undefined}
                    className={cn(
                      'teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] hover:teal-u-bg-surface-container-high/70',
                      selected && 'teal-u-bg-primary/5',
                    )}
                  >
                    {selectable ? (
                      <td className={cellPadding}>
                        <Checkbox
                          aria-label="Select row"
                          checked={selected}
                          onCheckedChange={() => toggleRow(rowKey)}
                        />
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td key={column.key} className={cn('teal-u-text-on-surface', cellPadding, column.cellClassName)}>
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                )
              })}
          {!loading && rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="teal-u-px-4 teal-u-py-10 teal-u-text-center teal-u-text-sm teal-u-text-on-surface-variant">
                {empty}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}

/** A Table with caller-owned sorting and row selection layered on top. */
export const DataTable = forwardRef(DataTableRender) as <Row>(
  props: DataTableProps<Row> & { ref?: Ref<HTMLDivElement> },
) => ReactElement
