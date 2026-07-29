import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react'
import { Pencil } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { fieldVariants } from './Input'

export interface EditableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSubmit' | 'defaultValue'> {
  /** Initial text when uncontrolled. */
  defaultValue?: string
  /** Prevents switching to edit mode. */
  disabled?: boolean
  /** Accessible name describing the edited text. */
  label?: string
  /** Called with the draft text on every keystroke while editing. */
  onChange?: (value: string) => void
  /** Called with the final text when a draft is committed (Enter or blur). */
  onSubmit?: (value: string) => void
  /** Text shown in preview mode when the value is empty. */
  placeholder?: string
  /** Controlled text shown in preview mode. */
  value?: string
}

export const Editable = forwardRef<HTMLDivElement, EditableProps>(function Editable(
  { className, defaultValue = '', disabled = false, label = 'text', onChange, onSubmit, placeholder = 'Empty', value, ...props },
  ref,
) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const committed = value !== undefined ? value : internalValue
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  // Set by Escape so the following blur cancels instead of committing.
  const cancelNextBlur = useRef(false)

  function startEdit() {
    if (disabled) return
    setDraft(committed)
    setEditing(true)
  }

  function commit() {
    setEditing(false)
    if (value === undefined) setInternalValue(draft)
    onSubmit?.(draft)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      // Route through blur so the commit happens exactly once.
      event.currentTarget.blur()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      cancelNextBlur.current = true
      event.currentTarget.blur()
    }
  }

  function handleBlur() {
    if (cancelNextBlur.current) {
      cancelNextBlur.current = false
      setEditing(false)
      return
    }
    commit()
  }

  return (
    <div ref={ref} className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-1', className)} {...props}>
      {editing ? (
        <input
          type="text"
          autoFocus
          aria-label={label}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            onChange?.(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={(event) => event.currentTarget.select()}
          className={cn(fieldVariants(), 'teal-u-min-h-9 teal-u-py-1.5')}
        />
      ) : (
        <>
          <button
            type="button"
            disabled={disabled}
            onClick={startEdit}
            className={cn(
              'teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-rounded-lg teal-u-px-2 teal-u-py-1.5 teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high disabled:teal-u-cursor-not-allowed disabled:teal-u-opacity-55',
              committed === '' && 'teal-u-text-on-surface-variant',
            )}
          >
            {committed === '' ? placeholder : committed}
          </button>
          <IconButton label={`Edit ${label}`} size="sm" disabled={disabled} onClick={startEdit}>
            <Pencil aria-hidden="true" />
          </IconButton>
        </>
      )}
    </div>
  )
})
