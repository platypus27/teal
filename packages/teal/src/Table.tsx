import { forwardRef, useCallback, useRef, useState, type ReactElement, type ReactNode, type Ref } from 'react'
import { Skeleton } from './LoadingState'
import { cn } from './cn'

export interface TableColumn<Row> {
  /** Renders the cell content for a given row. */
  cell: (row: Row) => ReactNode
  /** Extra classes applied to every body cell in this column. */
  cellClassName?: string
  /** Content rendered in the column header. */
  header: ReactNode
  /** Extra classes applied to the column header cell. */
  headerClassName?: string
  /** Stable key identifying the column. */
  key: string
}

export interface TableProps<Row> {
  /** Accessible caption describing the table, announced to screen readers. */
  caption: string
  className?: string
  /** Column definitions rendered in header order. */
  columns: Array<TableColumn<Row>>
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
  /** Data rows rendered in the table body. */
  rows: Row[]
}

/** Reports when the observed element's content overflows horizontally. */
function useOverflowing() {
  const [overflowing, setOverflowing] = useState(false)
  const observerRef = useRef<ResizeObserver | null>(null)
  const refCallback = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect()
    observerRef.current = null
    if (node) {
      const measure = () => setOverflowing(node.scrollWidth - node.clientWidth > 1)
      measure()
      observerRef.current = new ResizeObserver(measure)
      observerRef.current.observe(node)
    }
  }, [])
  return [overflowing, refCallback] as const
}

function TableRender<Row>(
  {
    caption,
    className,
    columns,
    density = 'comfortable',
    empty = 'No results',
    getRowKey,
    loading = false,
    loadingLabel = 'Loading table data',
    rows,
  }: TableProps<Row>,
  ref: Ref<HTMLDivElement>,
) {
  const [overflowing, overflowRef] = useOverflowing()
  const setRefs = (node: HTMLDivElement | null) => {
    overflowRef(node)
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }
  return (
    <div
      ref={setRefs}
      role="region"
      aria-label={`${caption} table`}
      aria-busy={loading || undefined}
      tabIndex={overflowing ? 0 : undefined}
      className={cn(
        'overflow-x-auto rounded-2xl border border-outline-variant/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      {loading ? (
        <span role="status" className="sr-only">
          {loadingLabel}
        </span>
      ) : null}
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className={cn('text-xs font-semibold uppercase tracking-wide text-on-surface-variant', 'bg-surface-container-high')}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(density === 'compact' ? 'px-3 py-2' : 'px-4 py-3', column.headerClassName)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn('divide-y divide-outline-variant/25', 'bg-surface-container')}>
          {loading
            ? Array.from({ length: 3 }, (_, rowIndex) => (
                <tr key={`loading-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column.key} className={density === 'compact' ? 'px-3 py-2' : 'px-4 py-3'}>
                      <Skeleton className="h-4 w-4/5" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={getRowKey(row)} className="transition-colors hover:bg-surface-container-high/70">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'text-on-surface',
                        density === 'compact' ? 'px-3 py-2' : 'px-4 py-3',
                        column.cellClassName,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
          {!loading && rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-on-surface-variant">
                {empty}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}

export const Table = forwardRef(TableRender) as <Row>(
  props: TableProps<Row> & { ref?: Ref<HTMLDivElement> },
) => ReactElement
