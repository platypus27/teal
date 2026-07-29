import { forwardRef, useState } from 'react'
import { cn } from './cn'
import { Input } from './Input'
import { Popover } from './Popover'

interface ColorPreset {
  name: string
  value: string
}

const presets: ColorPreset[] = [
  { name: 'Teal', value: '#006a6c' },
  { name: 'Deep teal', value: '#065a60' },
  { name: 'Green', value: '#00734a' },
  { name: 'Mint', value: '#34d399' },
  { name: 'Amber', value: '#aa4b00' },
  { name: 'Red', value: '#c81e41' },
  { name: 'Ink', value: '#0e2c2c' },
  { name: 'Slate', value: '#64807d' },
  { name: 'Mist', value: '#eaf2f0' },
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
]

/** Normalizes "#rgb"/"#rrggbb" (with or without "#") to lowercase "#rrggbb". */
function normalizeHex(input: string): string | null {
  const match = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(input.trim())
  const hex = match?.[1]?.toLowerCase()
  if (hex === undefined) return null
  if (hex.length === 3) {
    return `#${hex
      .split('')
      .map((char) => char + char)
      .join('')}`
  }
  return `#${hex}`
}

export interface ColorPickerProps {
  /** Accessible name for the trigger button. */
  label?: string
  className?: string
  /** Initial hex color when uncontrolled. Defaults to the teal primary. */
  defaultValue?: string
  /** Prevents opening the picker. */
  disabled?: boolean
  /** Called with the normalized "#rrggbb" value after every selection. */
  onChange?: (value: string) => void
  /** Controlled hex color value. */
  value?: string
}

export const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(function ColorPicker(
  { className, defaultValue = '#006a6c', disabled = false, label = 'Choose color', onChange, value },
  ref,
) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const current = normalizeHex(value !== undefined ? value : internalValue) ?? '#006a6c'
  const [open, setOpen] = useState(false)
  const [hexDraft, setHexDraft] = useState(current)
  const [hexInvalid, setHexInvalid] = useState(false)

  function commit(color: string) {
    if (value === undefined) setInternalValue(color)
    setHexDraft(color)
    onChange?.(color)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setHexDraft(current)
      setHexInvalid(false)
    }
  }

  function tryCommitHex() {
    const normalized = normalizeHex(hexDraft)
    if (normalized === null) {
      setHexInvalid(true)
      return
    }
    commit(normalized)
  }

  return (
    <Popover
      label={label}
      open={open}
      onOpenChange={handleOpenChange}
      align="start"
      trigger={
        <button
          ref={ref}
          type="button"
          aria-label={label}
          disabled={disabled}
          className={cn(
            'teal-focus-ring teal-u-inline-flex teal-u-h-10 teal-u-items-center teal-u-gap-2 teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-px-3 teal-u-text-sm teal-u-text-on-surface hover:teal-u-border-outline disabled:teal-u-cursor-not-allowed disabled:teal-u-opacity-55',
            className,
          )}
        >
          <span
            aria-hidden="true"
            className="teal-u-size-5 teal-u-rounded-md teal-u-border teal-u-border-solid teal-u-border-outline-variant"
            style={{ backgroundColor: current }}
          />
          <span className="teal-u-font-medium teal-u-tabular-nums">{current}</span>
        </button>
      }
    >
      <div className="teal-u-grid teal-u-gap-3">
        <div role="group" aria-label="Preset colors" className="teal-u-grid teal-u-grid-cols-6 teal-u-gap-2">
          {presets.map((preset) => {
            const isSelected = preset.value === current
            return (
              <button
                key={preset.value}
                type="button"
                aria-label={preset.name}
                aria-pressed={isSelected}
                onClick={() => {
                  commit(preset.value)
                  setOpen(false)
                }}
                className={cn(
                  'teal-focus-ring teal-u-size-8 teal-u-rounded-lg teal-u-border teal-u-border-solid teal-u-border-outline-variant',
                  isSelected && 'teal-u-shadow-[0_0_0_2px_var(--teal-color-surface),0_0_0_4px_var(--teal-color-primary)]',
                )}
                style={{ backgroundColor: preset.value }}
              />
            )
          })}
        </div>
        <Input
          size="sm"
          aria-label="Hex color"
          aria-invalid={hexInvalid || undefined}
          value={hexDraft}
          onChange={(event) => {
            setHexDraft(event.target.value)
            setHexInvalid(false)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              tryCommitHex()
            }
          }}
          onBlur={tryCommitHex}
          placeholder="#006a6c"
        />
      </div>
    </Popover>
  )
})
