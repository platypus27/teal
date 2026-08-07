import { forwardRef, useMemo, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { Avatar } from './Avatar'
import { cn } from './cn'

export interface ActivityFeedItem {
  /** What the actor did, e.g. "approved the budget request". */
  action: string
  /** Name of the person or system that performed the action. */
  actor: string
  /** Optional image URL for the actor avatar. */
  avatarSrc?: string
  /** Optional icon node rendered instead of the actor avatar. */
  icon?: ReactNode
  /** Unique id used as the React key. */
  id: string
  /** When the event happened. */
  timestamp: Date | string | number
}

export interface ActivityFeedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Message shown when there are no items. */
  emptyMessage?: string
  /** Formats the day heading when `groupByDay` is on; defaults to Today/Yesterday/weekday labels. */
  formatDay?: (day: Date) => string
  /** Formats each item timestamp. */
  formatTime?: (timestamp: Date | string | number) => string
  /** Groups items under a heading per day. */
  groupByDay?: boolean
  /** Events to display, newest first. */
  items: ActivityFeedItem[]
  /** Accessible name for the feed. */
  label?: string
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

function toDate(timestamp: Date | string | number): Date {
  return timestamp instanceof Date ? timestamp : new Date(timestamp)
}

function defaultFormatTime(timestamp: Date | string | number): string {
  return timeFormatter.format(toDate(timestamp))
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function defaultFormatDay(day: Date): string {
  const today = new Date()
  if (isSameDay(day, today)) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (isSameDay(day, yesterday)) return 'Yesterday'
  return dayFormatter.format(day)
}

interface ItemGroup {
  day: Date | null
  items: ActivityFeedItem[]
}

export const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(function ActivityFeed(
  {
    className,
    emptyMessage = 'No activity yet',
    formatDay = defaultFormatDay,
    formatTime = defaultFormatTime,
    groupByDay = false,
    items,
    label = 'Activity',
    ...props
  },
  ref,
) {
  const articleRefs = useRef<Array<HTMLDivElement | null>>([])
  articleRefs.current = []

  const groups = useMemo<Array<ItemGroup>>(() => {
    if (!groupByDay) return [{ day: null, items }]
    const byDay = new Map<string, ItemGroup>()
    for (const item of items) {
      const day = toDate(item.timestamp)
      const key = day.toDateString()
      const group = byDay.get(key)
      if (group) group.items.push(item)
      else byDay.set(key, { day, items: [item] })
    }
    return Array.from(byDay.values())
  }, [groupByDay, items])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'PageDown' && event.key !== 'PageUp') return
    const articles = articleRefs.current.filter((node): node is HTMLDivElement => node !== null)
    const index = articles.indexOf(document.activeElement as HTMLDivElement)
    if (index === -1) return
    event.preventDefault()
    const next = event.key === 'PageDown' ? Math.min(articles.length - 1, index + 1) : Math.max(0, index - 1)
    articles[next]?.focus()
  }

  let articleIndex = -1

  function renderItem(item: ActivityFeedItem, dayLabel: string | null = null) {
    articleIndex += 1
    const index = articleIndex
    const time = formatTime(item.timestamp)
    const row = (
      <div aria-hidden="true" className="teal-u-flex teal-u-min-w-0 teal-u-items-start teal-u-gap-3">
        {item.icon ?? (
          <Avatar size="sm" name={item.actor} {...(item.avatarSrc !== undefined ? { src: item.avatarSrc } : {})} />
        )}
        <div className="teal-u-min-w-0">
          <p className="teal-u-text-sm teal-u-text-on-surface">
            <span className="teal-u-font-semibold">{item.actor}</span> {item.action}
          </p>
          <time
            dateTime={toDate(item.timestamp).toISOString()}
            className="teal-u-text-xs teal-u-text-on-surface-variant"
          >
            {time}
          </time>
        </div>
      </div>
    )
    return (
      <div
        key={item.id}
        ref={(node) => {
          articleRefs.current[index] = node
        }}
        role="article"
        tabIndex={0}
        aria-posinset={index + 1}
        aria-setsize={items.length}
        aria-label={`${item.actor} ${item.action}, ${time}`}
        className="teal-focus-ring teal-u-rounded-lg teal-u-p-2"
      >
        {dayLabel ? (
          <h3 className="teal-u-mb-1 teal-u-text-xs teal-u-font-semibold teal-u-uppercase teal-u-tracking-wider teal-u-text-on-surface-variant">
            {dayLabel}
          </h3>
        ) : null}
        {row}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      role="feed"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('teal-u-flex teal-u-flex-col teal-u-gap-4', className)}
      {...props}
    >
      {items.length === 0 ? (
        <p className="teal-u-text-sm teal-u-text-on-surface-variant">{emptyMessage}</p>
      ) : (
        groups.map((group, groupIndex) => (
          <section key={group.day ? group.day.toDateString() : 'all'} className={cn(groupIndex > 0 && 'teal-u-mt-2')}>
            <div className="teal-u-flex teal-u-flex-col teal-u-gap-1">
              {group.items.map((item, itemIndex) =>
                renderItem(item, group.day && itemIndex === 0 ? formatDay(group.day) : null),
              )}
            </div>
          </section>
        ))
      )}
    </div>
  )
})
