import { cn } from './cn.js'

export function Checkbox({ checked, onChange, disabled, label, className = '', ...props }) {
  return (
    <label
      className={cn(
        'group inline-flex select-none items-center gap-2.5',
        disabled ? 'opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" {...props} />
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border bg-surface-container transition-colors',
          'border-outline-variant group-hover:border-primary/60 peer-checked:border-primary peer-checked:bg-primary',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-surface',
        )}
      >
        <svg
          className={cn('h-3.5 w-3.5 text-on-primary transition-all', checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {label && <span className="text-sm text-on-surface">{label}</span>}
    </label>
  )
}
