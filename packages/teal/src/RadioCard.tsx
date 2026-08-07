import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from './cn'

const nextKeys = new Set(['ArrowRight', 'ArrowDown'])
const prevKeys = new Set(['ArrowLeft', 'ArrowUp'])

export interface RadioCardOption {
  /** Value submitted for this option. */
  value: string
  /** Card heading. */
  title: ReactNode
  /** Supporting text rendered below the title. */
  description?: ReactNode
  /** Optional icon rendered above the title. */
  icon?: ReactNode
  /** Disables just this option. */
  disabled?: boolean
}

export interface RadioCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Initially selected value when uncontrolled. */
  defaultValue?: string
  /** Accessible name for the card group. */
  label: string
  /** Called with the value of the newly selected card. */
  onChange?: (value: string) => void
  /** Cards rendered as radios inside the group. */
  options: RadioCardOption[]
  /** Layout direction of the cards. */
  orientation?: 'vertical' | 'horizontal'
  /** Controlled selected value. */
  value?: string
}

/**
 * A radio group where each option is a selectable card with a title,
 * description, and optional icon. Arrow keys move and select like a native
 * radio group; the selected card holds the single tab stop.
 */
export const RadioCard = forwardRef<HTMLDivElement, RadioCardProps>(function RadioCard(
  { className, defaultValue, label, onChange, options, orientation = 'vertical', value, ...props },
  ref,
) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selected = value !== undefined ? value : internalValue
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])

  const enabledIndexes = options.reduce<number[]>((acc, option, index) => {
    if (!option.disabled) acc.push(index)
    return acc
  }, [])

  function commit(next: string) {
    if (value === undefined) setInternalValue(next)
    onChange?.(next)
  }

  function moveTo(index: number) {
    const option = options[index]
    if (!option) return
    commit(option.value)
    cardRefs.current[index]?.focus()
  }

  function step(from: number, delta: number) {
    if (enabledIndexes.length === 0) return
    const position = enabledIndexes.indexOf(from)
    const nextPosition =
      position === -1
        ? delta > 0
          ? 0
          : enabledIndexes.length - 1
        : (position + delta + enabledIndexes.length) % enabledIndexes.length
    const nextIndex = enabledIndexes[nextPosition]
    if (nextIndex !== undefined) moveTo(nextIndex)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const firstIndex = enabledIndexes[0]
    if (firstIndex === undefined) return
    const lastIndex = enabledIndexes[enabledIndexes.length - 1] ?? firstIndex
    const currentIndex = cardRefs.current.findIndex((node) => node === document.activeElement)
    const selectedEnabled = enabledIndexes.find((index) => options[index]?.value === selected)
    const fromIndex = currentIndex !== -1 ? currentIndex : selectedEnabled ?? firstIndex

    if (nextKeys.has(event.key)) {
      event.preventDefault()
      step(fromIndex, 1)
    } else if (prevKeys.has(event.key)) {
      event.preventDefault()
      step(fromIndex, -1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveTo(firstIndex)
    } else if (event.key === 'End') {
      event.preventDefault()
      moveTo(lastIndex)
    }
  }

  const selectedIndex = options.findIndex((option) => option.value === selected)
  const selectedOption = selectedIndex !== -1 ? options[selectedIndex] : undefined
  const tabStop = selectedOption && !selectedOption.disabled ? selectedIndex : enabledIndexes[0]

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn(
        orientation === 'horizontal' ? 'teal-u-flex teal-u-flex-wrap teal-u-gap-3' : 'teal-u-grid teal-u-gap-3',
        className,
      )}
      {...props}
    >
      {options.map((option, index) => {
        const checked = option.value === selected
        return (
          <button
            key={option.value}
            ref={(node) => {
              cardRefs.current[index] = node
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-disabled={option.disabled || undefined}
            tabIndex={option.disabled || index !== tabStop ? -1 : 0}
            onClick={() => {
              if (!option.disabled) commit(option.value)
            }}
            className={cn(
              'teal-focus-ring teal-u-flex teal-u-min-w-40 teal-u-flex-1 teal-u-flex-col teal-u-items-start teal-u-gap-1 teal-u-rounded-2xl teal-u-border teal-u-border-solid teal-u-p-4 teal-u-text-left teal-u-transition-colors',
              checked
                ? 'teal-u-border-primary teal-u-bg-primary/5'
                : 'teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container hover:teal-u-border-[color:var(--teal-border-strong)]',
              option.disabled && 'teal-u-cursor-not-allowed teal-u-opacity-50',
            )}
          >
            {option.icon ? (
              <span
                aria-hidden="true"
                className={cn(
                  'teal-u-mb-1 teal-u-inline-flex [&_svg]:teal-u-size-[var(--teal-icon-md)]',
                  checked ? 'teal-u-text-primary' : 'teal-u-text-on-surface-variant',
                )}
              >
                {option.icon}
              </span>
            ) : null}
            <span className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{option.title}</span>
            {option.description ? (
              <span className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
                {option.description}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
})
