import { type ReactNode } from 'react'
import { Skeleton } from './LoadingState'
import { cn } from './cn'

export interface TableColumn<Row> {
  cell: (row: Row) => ReactNode
  cellClassName?: string
  header: ReactNode
  headerClassName?: string
  key: string
}

export interface TableProps<Row> {
  caption: string
  className?: string
  columns: Array<TableColumn<Row>>
  density?: 'compact' | 'comfortable'
  empty?: ReactNode
  getRowKey: (row: Row) => string
  loading?: boolean
  loadingLabel?: string
  rows: Row[]
}

export function Table<Row>({
  caption,
  className,
  columns,
  density = 'comfortable',
  empty = 'No results',
  getRowKey,
  loading = false,
  loadingLabel = 'Loading table data',
  rows,
}: TableProps<Row>) {
  return (
    <div
      role="region"
      aria-label={`${caption} table`}
      tabIndex={0}
      className={cn('overflow-x-auto rounded-2xl border border-outline-variant/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', className)}
    >
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-container-high text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
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
        <tbody className="divide-y divide-outline-variant/25 bg-surface-container">
          {loading
            ? Array.from({ length: 3 }, (_, rowIndex) => (
                <tr key={`loading-${rowIndex}`} aria-label={loadingLabel}>
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
