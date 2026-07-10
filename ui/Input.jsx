import { Children, isValidElement, useEffect, useRef, useState } from 'react'
import { cn } from './cn.js'

const fieldBase =
  'w-full rounded-xl border border-outline-variant bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60'

export function Input({ className = '', ...props }) {
  return <input className={cn(fieldBase, className)} {...props} />
}

export function Select({ children, value, defaultValue, onChange, className = '', name, disabled, placeholder, ...props }) {
  const options = Children.toArray(children)
    .filter(isValidElement)
    .map((c) => ({
      value: c.props.value ?? (typeof c.props.children === 'string' ? c.props.children : ''),
      label: c.props.children,
      disabled: c.props.disabled,
    }))

  const placeholderOption = options.find((o) => o.disabled)
  const placeholderText = placeholder ?? placeholderOption?.label ?? 'Select…'

  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue ?? '')
  const selected = isControlled ? value : internal
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(v) {
    if (!isControlled) setInternal(v)
    onChange?.({ target: { value: v, name } })
    setOpen(false)
  }

  const selectedLabel = selected ? options.find((o) => o.value === selected)?.label : null

  return (
    <span ref={ref} className={cn('relative block w-full', className)}>
      {name ? <input type="hidden" name={name} value={selected ?? ''} /> : null}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(fieldBase, 'flex items-center justify-between gap-2 text-left', disabled && 'cursor-not-allowed')}
        {...props}
      >
        <span className={cn('truncate', !selected && 'text-on-surface-variant/60')}>{selectedLabel ?? placeholderText}</span>
        <span
          className={cn('material-symbols-outlined text-[20px] text-on-surface-variant transition-transform', open && 'rotate-180')}
        >
          expand_more
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-20 mt-1.5 max-h-60 overflow-auto rounded-xl border border-outline-variant/40 bg-surface-container p-1 shadow-[0_12px_32px_-12px_rgba(0,100,102,0.25)]"
        >
          {options.map((o) => {
            const active = o.value === selected
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={active}
                aria-disabled={o.disabled || undefined}
                onClick={() => !o.disabled && choose(o.value)}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition',
                  active ? 'bg-primary/10 font-semibold text-primary' : 'text-on-surface hover:bg-surface-container-high',
                  o.disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                <span className="truncate">{o.label}</span>
                {active && <span className="material-symbols-outlined text-[16px]">check</span>}
              </li>
            )
          })}
        </ul>
      )}
    </span>
  )
}

export function TextArea({ className = '', ...props }) {
  return <textarea className={cn(fieldBase, 'min-h-[120px] resize-y', className)} {...props} />
}
