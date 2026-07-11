import { useState } from 'react'
import { Pagination } from '@kryv/teal'

export function PaginationDemo() {
  const [page, setPage] = useState(3)
  return <Pagination page={page} pageCount={8} onPageChange={setPage} />
}
