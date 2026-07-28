import { type ReactNode } from 'react'
import { Table } from './Table'

export interface PermissionMatrixColumn {
  /** Identifier matching the keys of each row's `cells`. */
  id: string
  /** Visible application label. */
  label: ReactNode
}

export interface PermissionMatrixRow {
  /** Access content keyed by column id. Policy decisions stay with the caller. */
  cells: Record<string, ReactNode>
  /** Unique identifier for the row. */
  id: string
  /** Visible row label, such as a household member or capability name. */
  label: ReactNode
}

export interface PermissionMatrixProps {
  /** Accessible caption describing the matrix. */
  caption: string
  className?: string
  /** Application columns rendered in header order. */
  columns: PermissionMatrixColumn[]
  /** Content shown when a row has no entry for a column. Defaults to an em dash. */
  emptyCell?: ReactNode
  /** Rows of people or capabilities. */
  rows: PermissionMatrixRow[]
  /** Accessible name for the row-label column, rendered visually hidden. Defaults to 'Name'. */
  rowHeader?: ReactNode
}

export function PermissionMatrix({
  caption,
  className,
  columns,
  emptyCell = '—',
  rowHeader = 'Name',
  rows,
}: PermissionMatrixProps) {
  return (
    <Table
      caption={caption}
      {...(className !== undefined ? { className } : {})}
      getRowKey={(row) => row.id}
      rows={rows}
      columns={[
        { key: '__label', header: <span className="teal-u-sr-only">{rowHeader}</span>, cell: (row) => row.label },
        ...columns.map((column) => ({
          key: column.id,
          header: column.label,
          cell: (row: PermissionMatrixRow) => row.cells[column.id] ?? emptyCell,
        })),
      ]}
    />
  )
}
