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
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLTableElement | null>(null)

  const observe = useCallback(() => {
    observerRef.current?.disconnect()
    observerRef.current = null
    const viewport = viewportRef.current
    if (!viewport) return

    const measure = () => setOverflowing(viewport.scrollWidth - viewport.clientWidth > 1)
    measure()
    observerRef.current = new ResizeObserver(measure)
    observerRef.current.observe(viewport)
    if (contentRef.current) observerRef.current.observe(contentRef.current)
  }, [])

  const setViewportRef = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node
    observe()
  }, [observe])
  const setContentRef = useCallback((node: HTMLTableElement | null) => {
    contentRef.current = node
    observe()
  }, [observe])

  return [overflowing, setViewportRef, setContentRef] as const
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
  const [overflowing, overflowRef, contentRef] = useOverflowing()
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
        'teal-raised-surface teal-focus-ring teal-u-overflow-x-auto teal-u-border teal-u-bg-surface-container',
        className,
      )}
    >
      {loading ? (
        <span role="status" className="teal-u-sr-only">
          {loadingLabel}
        </span>
      ) : null}
      <table ref={contentRef} className="teal-u-w-full teal-u-border-collapse teal-u-text-left teal-u-text-sm">
        <caption className="teal-u-sr-only">{caption}</caption>
        <thead className={cn('teal-u-text-xs teal-u-font-semibold teal-u-uppercase teal-u-tracking-wide teal-u-text-on-surface-variant', 'teal-u-bg-surface-container-highest')}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(density === 'compact' ? 'teal-u-px-3 teal-u-py-2' : 'teal-u-px-4 teal-u-py-3', column.headerClassName)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn('teal-u-divide-y teal-u-divide-outline-variant/40', 'teal-u-bg-surface')}>
          {loading
            ? Array.from({ length: 3 }, (_, rowIndex) => (
                <tr key={`loading-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column.key} className={density === 'compact' ? 'teal-u-px-3 teal-u-py-2' : 'teal-u-px-4 teal-u-py-3'}>
                      <Skeleton className="teal-u-h-4 teal-u-w-4/5" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={getRowKey(row)} className="teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] hover:teal-u-bg-surface-container-high/70">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'teal-u-text-on-surface',
                        density === 'compact' ? 'teal-u-px-3 teal-u-py-2' : 'teal-u-px-4 teal-u-py-3',
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
              <td colSpan={columns.length} className="teal-u-px-4 teal-u-py-10 teal-u-text-center teal-u-text-sm teal-u-text-on-surface-variant">
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
