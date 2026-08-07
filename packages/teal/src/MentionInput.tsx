import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from './cn'
import { fieldVariants } from './Input'
import { hasFormContent } from './form-semantics'

export interface MentionOption {
  /** Visible label inserted after the `@` when the option is chosen. */
  label: string
  /** Value passed to `onMentionSelect`. */
  value: string
}

export interface MentionInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'defaultValue' | 'value'> {
  /** Initial text when uncontrolled. */
  defaultValue?: string
  /** Visible label rendered above the textarea. */
  label?: ReactNode
  /** Called with the full text whenever it changes. */
  onChange?: (value: string) => void
  /** Called with the option after its mention token is inserted. */
  onMentionSelect?: (option: MentionOption) => void
  /** People or records offered by the @-mention autocomplete popup. */
  options: MentionOption[]
  /** Controlled text. */
  value?: string
}

interface ActiveMention {
  /** Index of the `@` character that opened the popup. */
  start: number
  /** Text typed between the `@` and the caret. */
  query: string
}

/** Finds an open `@token` immediately before the caret, or null when there is none. */
function detectMention(text: string, caret: number): ActiveMention | null {
  let index = caret - 1
  while (index >= 0) {
    const char = text[index] ?? ''
    if (char === '@') {
      const before = index === 0 ? ' ' : (text[index - 1] ?? ' ')
      return /\s/.test(before) ? { start: index, query: text.slice(index + 1, caret) } : null
    }
    if (/\s/.test(char)) return null
    index -= 1
  }
  return null
}

/**
 * Textarea with @-mention autocomplete: typing `@` opens a suggestion popup,
 * and choosing an option inserts the mention as a plain text token.
 */
export const MentionInput = forwardRef<HTMLTextAreaElement, MentionInputProps>(function MentionInput(
  {
    'aria-label': ariaLabel,
    className,
    defaultValue,
    id,
    label,
    onChange,
    onMentionSelect,
    onSelect,
    options,
    value,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const controlId = id ?? `teal-mention-input-${generatedId.replaceAll(':', '')}`
  const listboxId = `${controlId}-listbox`

  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const currentValue = value !== undefined ? value : internalValue
  const [mention, setMention] = useState<ActiveMention | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const pendingCaret = useRef<number | null>(null)

  useEffect(() => {
    const caret = pendingCaret.current
    if (caret === null) return
    pendingCaret.current = null
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.focus()
    textarea.setSelectionRange(caret, caret)
  })

  const normalized = mention?.query.toLowerCase() ?? ''
  const filtered = mention ? options.filter((option) => option.label.toLowerCase().includes(normalized)) : []
  const popupOpen = mention !== null && filtered.length > 0
  const clampedActiveIndex = Math.min(activeIndex, Math.max(0, filtered.length - 1))

  function commitValue(next: string) {
    if (value === undefined) setInternalValue(next)
    onChange?.(next)
  }

  function setTextareaRefs(node: HTMLTextAreaElement | null) {
    textareaRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  function trackMention(text: string, caret: number) {
    const next = detectMention(text, caret)
    setMention(next)
    setActiveIndex(0)
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    commitValue(event.target.value)
    trackMention(event.target.value, event.target.selectionStart ?? event.target.value.length)
  }

  function insertMention(option: MentionOption) {
    if (!mention) return
    const textarea = textareaRef.current
    const caret = textarea?.selectionStart ?? mention.start + 1 + mention.query.length
    const token = `@${option.label} `
    commitValue(currentValue.slice(0, mention.start) + token + currentValue.slice(caret))
    pendingCaret.current = mention.start + token.length
    setMention(null)
    onMentionSelect?.(option)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!popupOpen) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((clampedActiveIndex + 1) % filtered.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((clampedActiveIndex - 1 + filtered.length) % filtered.length)
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      const option = filtered[clampedActiveIndex]
      if (option) insertMention(option)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setMention(null)
    }
  }

  return (
    <div className={cn('teal-u-grid teal-u-gap-1.5', className)}>
      {hasFormContent(label) ? (
        <label htmlFor={controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      <div className="teal-u-relative">
        <textarea
          ref={setTextareaRefs}
          id={controlId}
          value={currentValue}
          // A textarea may not carry role="combobox" (single-line inputs only), so the
          // popup is exposed via the autocomplete-list textbox pattern instead.
          aria-label={ariaLabel}
          aria-controls={popupOpen ? listboxId : undefined}
          aria-activedescendant={popupOpen ? `${listboxId}-${clampedActiveIndex}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={(event) => {
            const textarea = event.currentTarget
            trackMention(textarea.value, textarea.selectionStart ?? textarea.value.length)
            onSelect?.(event)
          }}
          className={cn(fieldVariants(), 'teal-u-min-h-28 teal-u-resize-y teal-u-leading-relaxed')}
          {...props}
        />
        {popupOpen ? (
          <div
            role="listbox"
            id={listboxId}
            aria-label="Mentions"
            className="teal-overlay-surface teal-u-absolute teal-u-left-0 teal-u-top-full teal-u-z-[var(--teal-z-popover)] teal-u-mt-1 teal-u-max-h-48 teal-u-w-56 teal-u-overflow-y-auto teal-u-border teal-u-bg-surface teal-u-p-1 teal-u-text-on-surface"
          >
            {filtered.map((option, index) => (
              <div
                key={option.value}
                role="option"
                id={`${listboxId}-${index}`}
                aria-selected={index === clampedActiveIndex}
                className={cn(
                  'teal-u-flex teal-u-min-h-9 teal-u-cursor-default teal-u-select-none teal-u-items-center teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high',
                  index === clampedActiveIndex && 'teal-u-bg-surface-container-high',
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => insertMention(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
})
