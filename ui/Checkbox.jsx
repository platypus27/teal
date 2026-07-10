import { cn } from './cn.js'

export function Checkbox({ checked, onChange, disabled, label, className = '', ...props }) {
  return (
    <label className={cn('inline-flex items-center gap-2.5', disabled ? 'opacity-50' : 'cursor-pointer', className)}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" {...props} />
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-outline bg-surface-container transition peer-checked:border-primary peer-checked:bg-primary peer-hover:border-primary/60 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30">
        {checked && (
          <span
            className="material-symbols-outlined text-[16px] leading-none text-on-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check
          </span>
        )}
      </span>
      {label && <span className="text-sm text-on-surface">{label}</span>}
    </label>
  )
}
