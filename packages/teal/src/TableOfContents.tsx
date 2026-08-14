import { forwardRef, useState, type HTMLAttributes, type MouseEvent } from 'react'
import { cn } from './cn'
import { useScrollSpy } from './use-scroll-spy'

export interface TocHeading {
  /** Id of the heading element in the page (without the '#'). */
  id: string
  /** Heading level, 1-6; used to nest the list. */
  level: number
  /** Text of the heading. */
  title: string
}

interface TocNode extends TocHeading {
  children: TocNode[]
}

function buildTree(headings: TocHeading[]): TocNode[] {
  const root: TocNode[] = []
  const stack: TocNode[] = []
  for (const heading of headings) {
    const node: TocNode = { ...heading, children: [] }
    while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 0) >= heading.level) stack.pop()
    const parent = stack[stack.length - 1]
    if (parent) parent.children.push(node)
    else root.push(node)
    stack.push(node)
  }
  return root
}

export interface TableOfContentsProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** Accessible name for the navigation landmark. */
  'aria-label'?: string
  /** Controlled id of the active heading. */
  activeId?: string
  /** Initially active heading id when uncontrolled. */
  defaultActiveId?: string
  /** Flat list of headings in document order; nested by `level`. */
  headings: TocHeading[]
  /** Called with the heading id when the active heading changes. */
  onActiveChange?: (id: string) => void
}

export const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(function TableOfContents(
  { 'aria-label': ariaLabel = 'Table of contents', activeId, className, defaultActiveId, headings, onActiveChange, ...props },
  ref,
) {
  const [internalActive, setInternalActive] = useState<string | undefined>(defaultActiveId ?? headings[0]?.id)
  const active = activeId !== undefined ? activeId : internalActive

  function setActive(id: string) {
    if (activeId === undefined) setInternalActive(id)
    onActiveChange?.(id)
  }

  useScrollSpy(headings.map((heading) => heading.id).join(' '), setActive)

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    setActive(id)
    const target = document.getElementById(id)
    if (target && typeof target.scrollIntoView === 'function') {
      event.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function renderNodes(nodes: TocNode[], depth: number) {
    return (
      <ul className={cn('teal-u-space-y-1', depth > 0 && 'teal-u-mt-1 teal-u-pl-4')}>
        {nodes.map((node) => (
          <li key={node.id}>
            <a
              href={`#${node.id}`}
              aria-current={node.id === active ? 'location' : undefined}
              onClick={(event) => handleClick(event, node.id)}
              className={cn(
                'teal-focus-ring teal-u-block teal-u-rounded-md teal-u-py-1 teal-u-text-sm teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
                node.id === active
                  ? 'teal-u-font-semibold teal-u-text-primary'
                  : 'teal-u-text-on-surface-variant hover:teal-u-text-on-surface',
              )}
            >
              {node.title}
            </a>
            {node.children.length > 0 ? renderNodes(node.children, depth + 1) : null}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...props}>
      {renderNodes(buildTree(headings), 0)}
    </nav>
  )
})
