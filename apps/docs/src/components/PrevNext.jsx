import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { catalogGroups } from '../data/docs-module-registry.js'

const pageOrder = [
  { to: '/', label: 'Getting started' },
  { to: '/foundations', label: 'Foundations' },
  { to: '/changelog', label: 'Changelog' },
  ...catalogGroups.flatMap((group) =>
    group.modules.map((module) => ({ to: `/modules/${module.id}`, label: module.name })),
  ),
  { to: '/recipes', label: 'Recipes' },
]

const cardClass =
  'group flex items-center gap-3 rounded-2xl border border-teal-outline-variant/40 bg-teal-surface-container px-5 py-4 transition hover:border-teal-primary/40 hover:bg-teal-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary'

export function PrevNext() {
  const { pathname } = useLocation()
  const index = pageOrder.findIndex((page) => page.to === pathname)
  if (index === -1) return null
  const previous = pageOrder[index - 1]
  const next = pageOrder[index + 1]

  return (
    <nav aria-label="Pagination" className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 lg:px-12">
      <div className="grid gap-3 border-t border-teal-outline-variant/30 pt-8 sm:grid-cols-2">
        {previous ? (
          <Link to={previous.to} className={cardClass}>
            <ArrowLeft
              aria-hidden="true"
              className="size-4 shrink-0 text-teal-on-surface-variant transition group-hover:text-teal-primary"
            />
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wider text-teal-on-surface-variant">
                Previous
              </span>
              <span className="block truncate font-bold text-teal-on-surface">{previous.label}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link to={next.to} className={`${cardClass} justify-end text-right`}>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wider text-teal-on-surface-variant">
                Next
              </span>
              <span className="block truncate font-bold text-teal-on-surface">{next.label}</span>
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 shrink-0 text-teal-on-surface-variant transition group-hover:text-teal-primary"
            />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
