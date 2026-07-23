import { forwardRef } from 'react'
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

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { className, label = 'Pagination', onPageChange, page, pageCount },
  ref,
) {
  const safePageCount = Math.max(1, pageCount)
  const currentPage = Math.min(Math.max(1, page), safePageCount)
  return (
    <nav ref={ref} aria-label={label} className={cn('teal-u-flex teal-u-flex-wrap teal-u-items-center teal-u-justify-center teal-u-gap-1', className)}>
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
          <span key={`ellipsis-${index}`} aria-hidden="true" className="teal-u-px-2 teal-u-text-on-surface-variant">
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
              'teal-focus-ring teal-u-flex teal-u-size-8 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-xs teal-u-font-semibold',
              item === currentPage
                ? 'teal-u-bg-primary teal-u-text-on-primary'
                : 'teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface',
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
})
