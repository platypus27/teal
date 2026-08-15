import { forwardRef, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from './cn'
import { hasFormContent, isAriaTrue, mergeDescriptionIds, useFormSemantics } from './form-semantics'

const nextKeys = new Set(['ArrowRight', 'ArrowDown'])
const prevKeys = new Set(['ArrowLeft', 'ArrowUp'])

export interface RadioGroupOption {
  /** Value submitted for this option. */
  value: string
  /** Visible label rendered next to the radio; the card heading in the card variant. */
  label: ReactNode
  /** Supporting text rendered below the option label. */
  description?: ReactNode
  /** Optional icon rendered above the label in the card variant. */
  icon?: ReactNode
  /** Disables just this option. */
  disabled?: boolean
}

export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'children'> {
  /** Supporting text rendered below the group and linked to it for assistive technology. */
  description?: ReactNode
  /** Visible label for the whole group. */
  label?: ReactNode
  /** Options rendered as radios inside the group. */
  options: RadioGroupOption[]
  /** Layout direction of the options. */
  orientation?: 'vertical' | 'horizontal'
  /** Visual treatment: classic radios or selectable cards with a title, description, and optional icon. */
  variant?: 'radio' | 'card'
}

export const RadioGroup = forwardRef<React.ComponentRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  function RadioGroup(
    {
      'aria-describedby': describedBy,
      'aria-invalid': invalid,
      'aria-labelledby': labelledBy,
      className,
      defaultValue,
      description,
      id,
      label,
      onValueChange,
      options,
      orientation = 'vertical',
      required,
      value,
      variant = 'radio',
      ...props
    },
    ref,
  ) {
    const semantics = useFormSemantics({
      description,
      id,
      invalid: isAriaTrue(invalid),
      prefix: 'teal-radio-group',
      required,
    })
    const showLabel = hasFormContent(label) && !semantics.labeledByField
    const showDescription = hasFormContent(description)
    const labelId = `${semantics.controlId}-label`

    // Card variant state: hand-rolled roving-tabindex radiogroup (Radix does
    // not provide Home/End, wrap-around, or skip-disabled semantics).
    const [internalValue, setInternalValue] = useState(defaultValue)
    const selected = value !== undefined ? value : internalValue
    const cardRefs = useRef<Array<HTMLButtonElement | null>>([])

    const enabledIndexes = options.reduce<number[]>((acc, option, index) => {
      if (!option.disabled) acc.push(index)
      return acc
    }, [])

    function commit(next: string) {
      if (value === undefined) setInternalValue(next)
      onValueChange?.(next)
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
      // With nothing focused or selected, -1 makes the next step land on the
      // first (delta > 0) or last (delta < 0) enabled card.
      const fromIndex = currentIndex !== -1 ? currentIndex : selectedEnabled ?? -1

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

    // exactOptionalPropertyTypes: only pass controlled-state props when set.
    const radixValueProps = {
      ...(value !== undefined ? { value } : {}),
      ...(defaultValue !== undefined ? { defaultValue } : {}),
      ...(onValueChange !== undefined ? { onValueChange } : {}),
    }

    return (
      <div className="teal-u-grid teal-u-gap-2">
        {showLabel ? (
          <span id={labelId} className="teal-u-text-sm teal-u-font-medium teal-u-text-on-surface">
            {label}
          </span>
        ) : null}
        {variant === 'card' ? (
          <div
            ref={ref}
            id={semantics.controlId}
            role="radiogroup"
            aria-labelledby={labelledBy ?? (showLabel ? labelId : undefined)}
            aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
            aria-invalid={invalid ?? (semantics.invalid || undefined)}
            aria-required={semantics.required || undefined}
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
                  <span className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{option.label}</span>
                  {option.description ? (
                    <span className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
                      {option.description}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        ) : (
          <RadioGroupPrimitive.Root
            ref={ref}
            id={semantics.controlId}
            aria-labelledby={labelledBy ?? (showLabel ? labelId : undefined)}
            aria-describedby={mergeDescriptionIds(describedBy, semantics.descriptionId, semantics.errorId)}
            aria-invalid={invalid ?? (semantics.invalid || undefined)}
            aria-required={semantics.required || undefined}
            required={semantics.required}
            {...radixValueProps}
            className={cn(
              orientation === 'horizontal'
                ? 'teal-u-flex teal-u-flex-wrap teal-u-gap-x-6 teal-u-gap-y-3'
                : 'teal-u-grid teal-u-gap-3',
              className,
            )}
            {...props}
          >
            {options.map((option) => {
              const itemId = `${semantics.controlId}-${option.value}`
              return (
                <div key={option.value} className="teal-u-flex teal-u-items-start teal-u-gap-2.5">
                  <RadioGroupPrimitive.Item
                    id={itemId}
                    value={option.value}
                    disabled={option.disabled}
                    className="teal-focus-ring teal-u-box-border teal-u-mt-0.5 teal-u-flex teal-u-size-5 teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface hover:teal-u-border-primary disabled:teal-u-cursor-not-allowed disabled:teal-u-opacity-50 data-[state=checked]:teal-u-border-primary"
                  >
                    <RadioGroupPrimitive.Indicator className="teal-check-indicator teal-u-flex teal-u-items-center teal-u-justify-center">
                      <span className="teal-u-size-2.5 teal-u-rounded-full teal-u-bg-primary" />
                    </RadioGroupPrimitive.Indicator>
                  </RadioGroupPrimitive.Item>
                  <div className="teal-u-grid teal-u-gap-0.5">
                    <label
                      htmlFor={itemId}
                      className={cn(
                        'teal-u-text-sm teal-u-font-medium teal-u-text-on-surface',
                        option.disabled ? 'teal-u-cursor-not-allowed teal-u-opacity-50' : 'teal-u-cursor-pointer',
                      )}
                    >
                      {option.label}
                    </label>
                    {hasFormContent(option.description) ? (
                      <p className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
                        {option.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </RadioGroupPrimitive.Root>
        )}
        {showDescription ? (
          <p id={semantics.descriptionId} className="teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
    )
  },
)
