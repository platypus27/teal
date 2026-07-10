import { cn } from './cn.js'

export function LoadingState({ className = '' }) {
  return (
    <div className={cn('flex min-h-[240px] items-center justify-center rounded-2xl border border-outline-variant/10 bg-surface-container', className)}>
      <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
    </div>
  )
}
