export function LoadingState({ className = '' }) {
  return (
    <div className={`flex min-h-[240px] items-center justify-center rounded-[1.5rem] border border-outline-variant/10 bg-surface-container ${className}`}>
      <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
    </div>
  )
}
