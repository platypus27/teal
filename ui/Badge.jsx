const TONES = {
  high: 'bg-red-500/10 text-red-700',
  critical: 'bg-red-500/10 text-red-700',
  medium: 'bg-amber-500/10 text-amber-700',
  low: 'bg-emerald-500/10 text-emerald-700',
  success: 'bg-emerald-500/10 text-emerald-700',
  warning: 'bg-amber-500/10 text-amber-700',
  error: 'bg-red-500/10 text-red-700',
  info: 'bg-primary/10 text-primary',
  neutral: 'bg-surface-container-high text-on-surface-variant',
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${TONES[tone] || TONES.neutral} ${className}`}>
      {children}
    </span>
  )
}
