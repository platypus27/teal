import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { ArrowDownToLine, Pause } from 'lucide-react'
import { cn } from './cn'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogLine {
  /** Unique id used as the React key; falls back to the line index. */
  id?: string | number
  /** Severity used for coloring and the level prefix. */
  level?: LogLevel
  /** Log text. */
  message: string
  /** Optional preformatted timestamp shown before the level. */
  timestamp?: string
}

export interface LogViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Initial follow state when uncontrolled. */
  defaultFollow?: boolean
  /** Message shown when there are no lines. */
  emptyMessage?: string
  /** Controlled follow state; when true the pane auto-scrolls to the newest line. */
  follow?: boolean
  /** Accessible name for the log pane. */
  label?: string
  /** Lines to display, oldest first. */
  lines: LogLine[]
  /** Called when the user toggles follow mode. */
  onFollowChange?: (follow: boolean) => void
  /** Case-insensitive query highlighted inside each message. */
  search?: string
}

const levelClasses: Record<LogLevel, string> = {
  debug: 'teal-u-text-on-surface-variant',
  info: 'teal-u-text-primary',
  warn: 'teal-u-text-warning',
  error: 'teal-u-text-error',
}

function highlight(message: string, query: string | undefined): ReactNode {
  if (!query) return message
  const lowerMessage = message.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const parts: Array<ReactNode> = []
  let index = 0
  let match = lowerMessage.indexOf(lowerQuery)
  while (match !== -1) {
    if (match > index) parts.push(message.slice(index, match))
    parts.push(
      <mark key={match} className="teal-u-rounded-sm teal-u-bg-warning/30 teal-u-text-inherit">
        {message.slice(match, match + query.length)}
      </mark>,
    )
    index = match + query.length
    match = lowerMessage.indexOf(lowerQuery, index)
  }
  parts.push(message.slice(index))
  return parts
}

export const LogViewer = forwardRef<HTMLDivElement, LogViewerProps>(function LogViewer(
  {
    className,
    defaultFollow = true,
    emptyMessage = 'No log lines',
    follow,
    label = 'Logs',
    lines,
    onFollowChange,
    search,
    ...props
  },
  ref,
) {
  const [internalFollow, setInternalFollow] = useState(defaultFollow)
  const following = follow !== undefined ? follow : internalFollow
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const pane = scrollRef.current
    if (following && pane) pane.scrollTop = pane.scrollHeight
  }, [following, lines])

  function toggleFollow() {
    if (follow === undefined) setInternalFollow(!following)
    onFollowChange?.(!following)
  }

  return (
    <div
      ref={ref}
      className={cn(
        'teal-u-overflow-hidden teal-u-rounded-lg teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-lowest',
        className,
      )}
      {...props}
    >
      <div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-2 teal-u-border-0 teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-py-1 teal-u-pl-3 teal-u-pr-1.5">
        <span className="teal-u-text-xs teal-u-font-semibold teal-u-uppercase teal-u-tracking-wider teal-u-text-on-surface-variant">
          {label} · {lines.length} {lines.length === 1 ? 'line' : 'lines'}
        </span>
        <button
          type="button"
          aria-pressed={following}
          onClick={toggleFollow}
          className={cn(
            'teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-md teal-u-px-1.5 teal-u-py-0.5 teal-u-text-xs teal-u-font-semibold',
            following ? 'teal-u-text-primary' : 'teal-u-text-on-surface-variant',
            'hover:teal-u-bg-surface-container-high',
          )}
        >
          {following ? (
            <Pause aria-hidden="true" className="teal-u-size-3.5" />
          ) : (
            <ArrowDownToLine aria-hidden="true" className="teal-u-size-3.5" />
          )}
          {following ? 'Pause follow' : 'Follow'}
        </button>
      </div>
      <div
        ref={scrollRef}
        role="log"
        aria-label={label}
        tabIndex={0}
        className="teal-focus-ring teal-u-max-h-64 teal-u-overflow-y-auto teal-u-p-3 teal-u-font-mono teal-u-text-sm teal-u-leading-relaxed"
      >
        {lines.length === 0 ? (
          <p className="teal-u-text-on-surface-variant">{emptyMessage}</p>
        ) : (
          lines.map((line, index) => {
            const level = line.level ?? 'info'
            return (
              <div key={line.id ?? index} className="teal-u-flex teal-u-items-baseline teal-u-gap-2">
                {line.timestamp !== undefined ? (
                  <span className="teal-u-shrink-0 teal-u-text-on-surface-variant">{line.timestamp}</span>
                ) : null}
                <span className={cn('teal-u-w-12 teal-u-shrink-0 teal-u-font-semibold teal-u-uppercase', levelClasses[level])}>
                  {level}
                </span>
                <span className="teal-u-min-w-0 teal-u-whitespace-pre-wrap teal-u-text-on-surface">{highlight(line.message, search)}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
})
