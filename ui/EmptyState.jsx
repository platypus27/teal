import { cn } from './cn.js'

export function EmptyState({ icon = 'inbox', title = 'Nothing here', message, className = '' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-[1.5rem] border border-outline-variant/10 bg-surface-container p-10 text-center', className)}>
      <span className="material-symbols-outlined text-4xl text-on-surface-variant">{icon}</span>
      <h3 className="mt-4 font-headline text-lg font-bold text-on-surface">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-on-surface-variant">{message}</p>}
    </div>
  )
}
