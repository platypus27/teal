import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from './cn'

export interface OrgChartNode {
  /** Nested reports rendered below the node when expanded. */
  children?: OrgChartNode[]
  /** Stable, unique id for the node. */
  id: string
  /** Person's name, rendered prominently. */
  name: string
  /** Optional role or team line shown below the name. */
  title?: ReactNode
}

export interface OrgChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Controlled collapsed node ids. */
  collapsedIds?: string[]
  /** Initial collapsed node ids when uncontrolled. */
  defaultCollapsedIds?: string[]
  /** Accessible name for the chart. */
  label?: string
  /** Called with the full list of collapsed ids whenever it changes. */
  onCollapsedChange?: (collapsedIds: string[]) => void
  /** Root node of the hierarchy. */
  root: OrgChartNode
}

interface OrgNodeViewProps {
  collapsedSet: Set<string>
  node: OrgChartNode
  onToggle: (id: string) => void
}

function OrgNodeView({ collapsedSet, node, onToggle }: OrgNodeViewProps) {
  const hasChildren = (node.children?.length ?? 0) > 0
  const collapsed = collapsedSet.has(node.id)
  const expanded = hasChildren && !collapsed
  const childCount = node.children?.length ?? 0

  // Callers wrap this fragment in an <li>; the node itself renders its box and,
  // when expanded, a connector stub and a <ul> of child subtrees.
  return (
    <>
      <div className="teal-u-flex teal-u-flex-col teal-u-items-center teal-u-rounded-xl teal-u-border teal-u-border-outline-variant/30 teal-u-bg-surface teal-u-px-4 teal-u-py-3">
        <span className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{node.name}</span>
        {node.title !== undefined ? (
          <span className="teal-u-mt-0.5 teal-u-text-xs teal-u-text-on-surface-variant">{node.title}</span>
        ) : null}
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${node.name}'s reports`}
            onClick={() => onToggle(node.id)}
            className="teal-focus-ring teal-u-mt-2 teal-u-inline-flex teal-u-items-center teal-u-rounded-full teal-u-p-0.5 teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface"
          >
            {collapsed ? (
              <ChevronRight aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
            ) : (
              <ChevronDown aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
            )}
          </button>
        ) : null}
      </div>
      {expanded ? (
        <>
          <div aria-hidden="true" className="teal-u-h-4 teal-u-w-px teal-u-bg-outline-variant" />
          <ul className="teal-u-flex teal-u-items-start teal-u-gap-4">
            {node.children?.map((child, index) => (
              <li key={child.id} className="teal-u-relative teal-u-flex teal-u-flex-col teal-u-items-center">
                {childCount > 1 ? (
                  <div
                    aria-hidden="true"
                    className={cn(
                      'teal-u-absolute teal-u-top-0 teal-u-h-px teal-u-bg-outline-variant',
                      index === 0 && 'teal-u-left-1/2 teal-u-right-0',
                      index > 0 && index < childCount - 1 && 'teal-u-left-0 teal-u-right-0',
                      index === childCount - 1 && 'teal-u-left-0 teal-u-right-1/2',
                    )}
                  />
                ) : null}
                <div aria-hidden="true" className="teal-u-h-4 teal-u-w-px teal-u-bg-outline-variant" />
                <OrgNodeView collapsedSet={collapsedSet} node={child} onToggle={onToggle} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  )
}

/** A hierarchy of person nodes rendered as connected boxes with collapsible subtrees. */
export const OrgChart = forwardRef<HTMLDivElement, OrgChartProps>(function OrgChart(
  { className, collapsedIds, defaultCollapsedIds = [], label = 'Organization chart', onCollapsedChange, root, ...props },
  ref,
) {
  const [internalCollapsed, setInternalCollapsed] = useState<string[]>(defaultCollapsedIds)
  const effectiveCollapsed = collapsedIds ?? internalCollapsed
  const collapsedSet = new Set(effectiveCollapsed)

  function toggle(id: string) {
    const next = collapsedSet.has(id)
      ? effectiveCollapsed.filter((entry) => entry !== id)
      : [...effectiveCollapsed, id]
    if (collapsedIds === undefined) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn('teal-u-overflow-x-auto teal-u-p-1', className)}
      {...props}
    >
      <ul className="teal-u-flex teal-u-justify-center">
        <li className="teal-u-flex teal-u-flex-col teal-u-items-center">
          <OrgNodeView collapsedSet={collapsedSet} node={root} onToggle={toggle} />
        </li>
      </ul>
    </div>
  )
})
