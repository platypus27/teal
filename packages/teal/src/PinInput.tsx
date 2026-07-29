import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { cn } from './cn'
import { fieldVariants } from './Input'

function digitsFromCode(code: string | undefined, length: number) {
  const chars = (code ?? '').replace(/\D/g, '').slice(0, length).split('')
  return Array.from({ length }, (_, index) => chars[index] ?? '')
}

export interface PinInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Initial code when uncontrolled. */
  defaultValue?: string
  /** Prevents interaction with every cell. */
  disabled?: boolean
  /** Accessible name for the cell group. */
  label?: string
  /** Number of cells; each cell holds one digit. */
  length?: number
  /** Masks each cell like a password field. */
  masked?: boolean
  /** Called with the current code (may contain gaps) after every edit. */
  onChange?: (code: string) => void
  /** Called with the full code once every cell is filled. */
  onComplete?: (code: string) => void
  /** Controlled code value. */
  value?: string
}

export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  { className, defaultValue, disabled = false, label = 'One-time code', length = 6, masked = false, onChange, onComplete, value, ...props },
  ref,
) {
  const [internalDigits, setInternalDigits] = useState<string[]>(() => digitsFromCode(defaultValue, length))
  const digits = value !== undefined ? digitsFromCode(value, length) : internalDigits
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  function commit(next: string[]) {
    if (value === undefined) setInternalDigits(next)
    const code = next.join('')
    onChange?.(code)
    if (next.every((digit) => digit !== '')) onComplete?.(code)
  }

  function focusCell(index: number) {
    inputRefs.current[Math.min(length - 1, Math.max(0, index))]?.focus()
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const filtered = event.target.value.replace(/\D/g, '')
    const next = [...digits]
    if (filtered === '') {
      next[index] = ''
      commit(next)
      return
    }
    // Take the last typed digit so typing over a filled cell replaces it.
    next[index] = filtered.slice(-1)
    commit(next)
    if (index < length - 1) focusCell(index + 1)
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && digits[index] === '' && index > 0) {
      event.preventDefault()
      focusCell(index - 1)
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusCell(index - 1)
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault()
      focusCell(index + 1)
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData('text').replace(/\D/g, '')
    if (text === '') return
    event.preventDefault()
    const next = [...digits]
    for (let offset = 0; offset < text.length; offset += 1) {
      const target = index + offset
      const char = text[offset]
      if (target >= length || char === undefined) break
      next[target] = char
    }
    commit(next)
    focusCell(Math.min(index + text.length, length - 1))
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-2', className)}
      {...props}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node
          }}
          type={masked ? 'password' : 'text'}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1} of ${length}`}
          disabled={disabled}
          value={digit}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          className={cn(
            fieldVariants(),
            'teal-u-size-11 teal-u-min-h-11 teal-u-px-0 teal-u-text-center teal-u-text-base teal-u-font-semibold teal-u-tabular-nums',
          )}
        />
      ))}
    </div>
  )
})
