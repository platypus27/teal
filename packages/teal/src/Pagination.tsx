import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export interface PaginationProps {
  className?: string
  /** Accessible name for the navigation landmark. */
  label?: string
  /** Called with the next page when the user navigates. */
  onPageChange: (page: number) => void
  /** Current page, one-based. */
  page: number
  /** Total number of pages. */
  pageCount: number
}

function pagesFor(page: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1)
  const visible = new Set([1, pageCount, page - 1, page, page + 1])
  const pages = [...visible].filter((item) => item >= 1 && item <= pageCount).sort((a, b) => a - b)
  const result: Array<number | 'ellipsis'> = []
  pages.forEach((item, index) => {
    const previous = pages[index - 1]
    if (previous !== undefined && item - previous > 1) result.push('ellipsis')
    result.push(item)
  })
  return result
}

export function Pagination({ className, label = 'Pagination', onPageChange, page, pageCount }: PaginationProps) {
  const safePageCount = Math.max(1, pageCount)
  const currentPage = Math.min(Math.max(1, page), safePageCount)
  return (
    <nav aria-label={label} className={cn('flex flex-wrap items-center justify-center gap-1', className)}>
      <IconButton
        label="Previous page"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft />
      </IconButton>
      {pagesFor(currentPage, safePageCount).map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} aria-hidden="true" className="px-2 text-on-surface-variant">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              'flex size-8 items-center justify-center rounded-full text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary',
              item === currentPage
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
            )}
          >
            {item}
          </button>
        ),
      )}
      <IconButton
        label="Next page"
        size="sm"
        disabled={currentPage >= safePageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight />
      </IconButton>
    </nav>
  )
}
