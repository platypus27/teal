import type { KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { addMonths, dateKey, getMonthGrid, isSameDay, monthFormatter, weekdayNames } from './date-utils'

export interface MonthGridRange {
  from: Date | null
  to: Date | null
}

export interface MonthGridProps {
  /** Date with roving `tabIndex={0}`; required when `keyboard` is set. */
  focusedDate?: Date
  isDayDisabled: (day: Date) => boolean
  /** Enables `data-date` attributes, roving tabindex, and grid key handling (pickers). Off for Calendar. */
  keyboard?: boolean
  /** Visible month; any day within it. */
  month: Date
  onFocusDay?: (day: Date) => void
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
  onMonthChange: (month: Date) => void
  onSelect: (day: Date) => void
  /** Range-band state; when set, start/end/in-range days render inside a full-width band cell. */
  range?: MonthGridRange | undefined
  /** Single selected day (ignored when `range` is set). */
  selected?: Date | null
}

export function MonthGrid({
  focusedDate,
  isDayDisabled,
  keyboard = false,
  month,
  onFocusDay,
  onKeyDown,
  onMonthChange,
  onSelect,
  range,
  selected,
}: MonthGridProps) {
  const days = getMonthGrid(month)
  const today = new Date()
  return (
    <>
      <div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-pb-2">
        <IconButton label="Previous month" size="sm" onClick={() => onMonthChange(addMonths(month, -1))}>
          <ChevronLeft aria-hidden="true" />
        </IconButton>
        <span aria-live="polite" className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {monthFormatter.format(month)}
        </span>
        <IconButton label="Next month" size="sm" onClick={() => onMonthChange(addMonths(month, 1))}>
          <ChevronRight aria-hidden="true" />
        </IconButton>
      </div>
      <div
        className={cn('teal-u-grid teal-u-grid-cols-7', range === undefined && 'teal-u-justify-items-center')}
        onKeyDown={onKeyDown}
      >
        {weekdayNames.map((name, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="teal-u-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-text-xs teal-u-font-semibold teal-u-text-on-surface-variant"
          >
            {name}
          </span>
        ))}
        {days.map((day) => {
          const isStart = range?.from != null && isSameDay(day, range.from)
          const isEnd = range?.to != null && isSameDay(day, range.to)
          const isInRange =
            range?.from != null &&
            range?.to != null &&
            day.getTime() > range.from.getTime() &&
            day.getTime() < range.to.getTime()
          const isSelected = !range && selected != null && isSameDay(day, selected)
          const isToday = isSameDay(day, today)
          const isOutsideMonth = day.getMonth() !== month.getMonth()
          const isDisabled = isDayDisabled(day)
          if (range !== undefined) {
            const hasBand = isInRange || (isStart && range.to != null) || (isEnd && range.from != null)
            return (
              <div
                key={dateKey(day)}
                data-date-cell={dateKey(day)}
                className={cn(
                  'teal-u-flex teal-u-h-9 teal-u-w-full teal-u-items-center teal-u-justify-center',
                  hasBand && 'teal-u-bg-primary/10',
                  isStart && range.to != null && 'teal-u-rounded-l-full',
                  isEnd && 'teal-u-rounded-r-full',
                )}
              >
                <button
                  type="button"
                  {...(keyboard
                    ? {
                        'data-date': dateKey(day),
                        tabIndex: focusedDate != null && isSameDay(day, focusedDate) ? 0 : -1,
                        onFocus: () => onFocusDay?.(day),
                      }
                    : {})}
                  disabled={isDisabled}
                  aria-pressed={isStart || isEnd || undefined}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => onSelect(day)}
                  className={cn(
                    'teal-focus-ring teal-u-box-border teal-u-inline-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-sm hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40',
                    !isStart && !isEnd && 'teal-u-text-on-surface',
                    isOutsideMonth && 'teal-u-text-on-surface-variant/50',
                    isToday && 'teal-u-border teal-u-border-solid teal-u-border-primary',
                    (isStart || isEnd) &&
                      'teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90',
                  )}
                >
                  {day.getDate()}
                </button>
              </div>
            )
          }
          return (
            <button
              key={dateKey(day)}
              type="button"
              {...(keyboard
                ? {
                    'data-date': dateKey(day),
                    tabIndex: focusedDate != null && isSameDay(day, focusedDate) ? 0 : -1,
                    onFocus: () => onFocusDay?.(day),
                  }
                : {})}
              disabled={isDisabled}
              aria-pressed={isSelected || isStart || isEnd || undefined}
              aria-current={isToday ? 'date' : undefined}
              onClick={() => onSelect(day)}
              className={cn(
                'teal-focus-ring teal-u-box-border teal-u-inline-flex teal-u-size-9 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-sm hover:teal-u-bg-surface-container-high disabled:teal-u-pointer-events-none disabled:teal-u-opacity-40',
                !isSelected && !isStart && !isEnd && 'teal-u-text-on-surface',
                isOutsideMonth && 'teal-u-text-on-surface-variant/50',
                isToday && 'teal-u-border teal-u-border-solid teal-u-border-primary',
                (isSelected || isStart || isEnd) &&
                  'teal-u-bg-primary teal-u-font-semibold teal-u-text-on-primary hover:teal-u-bg-primary/90',
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </>
  )
}
