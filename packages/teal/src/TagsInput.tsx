import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react'
import { cn } from './cn'
import { Chip } from './Chip'
import { fieldVariants } from './Input'

export interface TagsInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Prevents adding or removing tags. */
  disabled?: boolean
  /** Accessible name for the text entry. */
  label?: string
  /** Maximum number of tags; further entries are ignored. */
  max?: number
  /** Called with the next tag list after every add or remove. */
  onChange?: (tags: string[]) => void
  /** Placeholder shown in the text entry. */
  placeholder?: string
  /** Current tags. */
  value: string[]
}

export const TagsInput = forwardRef<HTMLDivElement, TagsInputProps>(function TagsInput(
  { className, disabled = false, label = 'Add tag', max, onChange, placeholder, value, ...props },
  ref,
) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(raw: string) {
    const tag = raw.trim()
    setDraft('')
    if (tag === '' || value.includes(tag)) return
    if (max !== undefined && value.length >= max) return
    onChange?.([...value, tag])
  }

  function removeAt(index: number) {
    if (disabled) return
    onChange?.(value.filter((_, i) => i !== index))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(draft)
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      event.preventDefault()
      removeAt(value.length - 1)
    }
  }

  return (
    <div
      ref={ref}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        fieldVariants(),
        'teal-u-flex teal-u-h-auto teal-u-min-h-10 teal-u-cursor-text teal-u-flex-wrap teal-u-items-center teal-u-gap-1.5 teal-u-py-1.5',
        disabled && 'teal-u-cursor-not-allowed teal-u-bg-surface-container-high teal-u-opacity-55',
        className,
      )}
      {...props}
    >
      {value.map((tag, index) => (
        <Chip key={tag} label={tag} disabled={disabled} onRemove={() => removeAt(index)} />
      ))}
      <input
        ref={inputRef}
        type="text"
        aria-label={label}
        disabled={disabled}
        placeholder={placeholder}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        className="teal-u-min-w-[6rem] teal-u-flex-1 teal-u-bg-transparent teal-u-text-sm teal-u-text-on-surface placeholder:teal-u-text-on-surface-variant focus:teal-u-outline-none disabled:teal-u-cursor-not-allowed"
      />
    </div>
  )
})
