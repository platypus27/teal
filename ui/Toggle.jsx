import { cn } from './cn.js'

export function Toggle({ checked, onChange, label, icon, disabled = false, compact = false, title, className = '' }) {
  const track = cn(
    'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
    checked ? 'border-primary bg-primary' : 'border-outline-variant bg-surface-container-highest',
  )
  const thumb = (
    <span
      className={cn(
        'absolute left-0.5 top-px h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
        checked ? 'translate-x-[18px]' : 'translate-x-0',
      )}
    />
  )

  if (compact) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        title={title}
        onClick={() => onChange(!checked)}
        className={cn(track, 'p-0', disabled && 'cursor-not-allowed opacity-60', className)}
      >
        {thumb}
      </button>
    )
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      title={title}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors',
        checked ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container-high',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
        {icon ? <span className="material-symbols-outlined text-base text-primary">{icon}</span> : null}
        <span className="leading-snug">{label}</span>
      </span>
      <span className={track}>{thumb}</span>
    </button>
  )
}
