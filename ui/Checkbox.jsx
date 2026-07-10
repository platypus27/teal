export function Checkbox({ checked, onChange, disabled, label, className = '', ...props }) {
  return (
    <label className={`inline-flex items-center gap-2 ${disabled ? 'opacity-50' : 'cursor-pointer'} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-outline-variant bg-surface-container-low transition peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30">
        {checked && (
          <span className="material-symbols-outlined text-[12px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            check
          </span>
        )}
      </span>
      {label && <span className="text-sm text-on-surface">{label}</span>}
    </label>
  )
}
