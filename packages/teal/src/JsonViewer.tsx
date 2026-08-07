import { forwardRef, useState, type HTMLAttributes } from 'react'
import { ChevronRight, Copy } from 'lucide-react'
import { cn } from './cn'

export interface JsonViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Shows a copy-path button on each row (revealed on hover). */
  copyable?: boolean
  /** The JSON-compatible value to inspect. */
  data: unknown
  /** Depth up to which objects and arrays start expanded; 0 collapses everything below the root. */
  defaultExpandedDepth?: number
  /** Accessible name for the viewer. */
  label?: string
  /** Label shown for the root node; defaults to "$". */
  rootName?: string
}

function isContainer(value: unknown): value is Record<string, unknown> | Array<unknown> {
  return value !== null && typeof value === 'object'
}

function childPath(parent: string, key: string | number): string {
  if (typeof key === 'number') return `${parent}[${key}]`
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? `${parent}.${key}` : `${parent}[${JSON.stringify(key)}]`
}

function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null) return <span className="teal-u-italic teal-u-text-on-surface-variant">null</span>
  if (typeof value === 'string') return <span className="teal-u-text-primary">{JSON.stringify(value)}</span>
  if (typeof value === 'number') return <span className="teal-u-text-tertiary">{String(value)}</span>
  if (typeof value === 'boolean') return <span className="teal-u-text-secondary">{String(value)}</span>
  return <span className="teal-u-text-on-surface">{String(value)}</span>
}

interface JsonNodeProps {
  copyable: boolean
  defaultExpandedDepth: number
  depth: number
  name: string
  path: string
  value: unknown
}

function JsonNode({ copyable, defaultExpandedDepth, depth, name, path, value }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(depth < defaultExpandedDepth)

  if (!isContainer(value)) {
    return (
      <div className="teal-u-group teal-u-flex teal-u-items-center teal-u-gap-1 teal-u-py-px" style={{ paddingLeft: depth * 16 }}>
        <span className="teal-u-inline-block teal-u-size-6 teal-u-shrink-0" aria-hidden="true" />
        <span className="teal-u-text-on-surface-variant">{name}:</span>
        <PrimitiveValue value={value} />
        {copyable ? <CopyPathButton path={path} /> : null}
      </div>
    )
  }

  const isArray = Array.isArray(value)
  const entries: Array<[string | number, unknown]> = isArray
    ? (value as Array<unknown>).map((item, index) => [index, item])
    : Object.entries(value as Record<string, unknown>)
  const summary = isArray ? `[${entries.length} ${entries.length === 1 ? 'item' : 'items'}]` : `{${entries.length} ${entries.length === 1 ? 'key' : 'keys'}}`

  return (
    <div>
      <div className="teal-u-group teal-u-flex teal-u-items-center teal-u-gap-1 teal-u-py-px" style={{ paddingLeft: depth * 16 }}>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={`Toggle ${name}`}
          onClick={() => setExpanded((value) => !value)}
          className="teal-focus-ring teal-u-inline-flex teal-u-size-6 teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-sm teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high"
        >
          <ChevronRight aria-hidden="true" className={cn('teal-u-size-3.5 teal-u-transition-transform', expanded && 'teal-u-rotate-90')} />
        </button>
        <span className="teal-u-text-on-surface-variant">{name}:</span>
        <span className="teal-u-text-on-surface-variant">{expanded ? (isArray ? '[' : '{') : summary}</span>
        {copyable ? <CopyPathButton path={path} /> : null}
      </div>
      {expanded ? (
        <div>
          {entries.map(([key, child]) => (
            <JsonNode
              key={key}
              copyable={copyable}
              defaultExpandedDepth={defaultExpandedDepth}
              depth={depth + 1}
              name={String(key)}
              path={childPath(path, key)}
              value={child}
            />
          ))}
          <div className="teal-u-py-px teal-u-text-on-surface-variant" style={{ paddingLeft: depth * 16 + 24 }}>
            {isArray ? ']' : '}'}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CopyPathButton({ path }: { path: string }) {
  return (
    <button
      type="button"
      aria-label={`Copy path ${path}`}
      title={path}
      onClick={() => {
        void navigator.clipboard?.writeText(path)
      }}
      className="teal-focus-ring teal-u-inline-flex teal-u-size-5 teal-u-items-center teal-u-justify-center teal-u-rounded-sm teal-u-text-on-surface-variant teal-u-opacity-0 hover:teal-u-bg-surface-container-high focus:teal-u-opacity-100 group-hover:teal-u-opacity-100"
    >
      <Copy aria-hidden="true" className="teal-u-size-3" />
    </button>
  )
}

export const JsonViewer = forwardRef<HTMLDivElement, JsonViewerProps>(function JsonViewer(
  { className, copyable = false, data, defaultExpandedDepth = 1, label = 'JSON viewer', rootName = '$', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-label={label}
      className={cn(
        'teal-u-overflow-auto teal-u-rounded-lg teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-lowest teal-u-p-3 teal-u-font-mono teal-u-text-sm',
        className,
      )}
      {...props}
    >
      <JsonNode copyable={copyable} defaultExpandedDepth={defaultExpandedDepth} depth={0} name={rootName} path={rootName} value={data} />
    </div>
  )
})
