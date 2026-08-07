import { useState } from 'react'
import { Pagination } from '@kryv/teal'

export function PaginationDemo({ exampleIndex = 0 }) {
  const [page, setPage] = useState(3)
  const [boundaryPage, setBoundaryPage] = useState(1)

  if (exampleIndex === 1) {
    return (
      <Pagination
        label="Audit log pages"
        page={boundaryPage}
        pageCount={8}
        onPageChange={setBoundaryPage}
      />
    )
  }

  return <Pagination page={page} pageCount={8} onPageChange={setPage} />
}
