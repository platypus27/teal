import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react'
import { Star } from 'lucide-react'
import { cn } from './cn'

const sizeClasses = {
  sm: 'teal-u-size-[var(--teal-icon-sm)]',
  md: 'teal-u-size-[var(--teal-icon-md)]',
  lg: 'teal-u-size-[var(--teal-icon-lg)]',
}

const arrowDeltas: Record<string, number> = {
  ArrowRight: 1,
  ArrowUp: 1,
  ArrowLeft: -1,
  ArrowDown: -1,
}

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Initial rating when uncontrolled. */
  defaultValue?: number
  /** Accessible name for the rating group. */
  label?: string
  /** Number of stars shown. */
  max?: number
  /** Called with the new rating when a star is chosen. */
  onChange?: (value: number) => void
  /** Renders static stars without any interaction. */
  readOnly?: boolean
  /** Star size. */
  size?: 'sm' | 'md' | 'lg'
  /** Controlled rating between 0 and `max`. */
  value?: number
}

export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  { className, defaultValue = 0, label = 'Rating', max = 5, onChange, readOnly = false, size = 'md', value, ...props },
  ref,
) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const rating = Math.min(max, Math.max(0, value !== undefined ? value : internalValue))
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const stars = Array.from({ length: max }, (_, index) => index + 1)

  function commit(next: number) {
    if (value === undefined) setInternalValue(next)
    onChange?.(next)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = arrowDeltas[event.key]
    if (delta === undefined) return
    event.preventDefault()
    const next = Math.min(max, Math.max(1, (rating >= 1 ? rating : 1) + delta))
    commit(next)
    buttonRefs.current[next - 1]?.focus()
  }

  function renderStar(index: number, filled: boolean) {
    return (
      <Star
        aria-hidden="true"
        fill={filled ? 'currentColor' : 'none'}
        className={cn(sizeClasses[size], filled ? 'teal-u-text-primary' : 'teal-u-text-on-surface-variant')}
      />
    )
  }

  if (readOnly) {
    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${rating} out of ${max} stars`}
        className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-0.5', className)}
        {...props}
      >
        {stars.map((index) => (
          <span key={index} aria-hidden="true" className="teal-u-inline-flex">
            {renderStar(index, index <= rating)}
          </span>
        ))}
      </div>
    )
  }

  // The checked star stays in the tab order; with no rating the first star is.
  const tabStop = rating >= 1 ? rating : 1

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-0.5', className)}
      {...props}
    >
      {stars.map((index) => (
        <button
          key={index}
          ref={(node) => {
            buttonRefs.current[index - 1] = node
          }}
          type="button"
          role="radio"
          aria-checked={index === rating}
          aria-label={`${index} star${index > 1 ? 's' : ''}`}
          tabIndex={index === tabStop ? 0 : -1}
          onClick={() => commit(index)}
          className="teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-justify-center teal-u-rounded-xl teal-u-p-0.5 hover:teal-u-bg-surface-container-high"
        >
          {renderStar(index, index <= rating)}
        </button>
      ))}
    </div>
  )
})
