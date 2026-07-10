import { cn } from './cn.js'

const fieldBase =
  'w-full rounded-xl border border-outline-variant bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60'

export function Input({ className = '', ...props }) {
  return <input className={cn(fieldBase, className)} {...props} />
}

export function Select({ children, className = '', ...props }) {
  return (
    <span className={cn('relative block w-full', className)}>
      <select className={cn(fieldBase, 'appearance-none pr-10')} {...props}>
        {children}
      </select>
      <span
        aria-hidden="true"
        className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant"
      >
        expand_more
      </span>
    </span>
  )
}

export function TextArea({ className = '', ...props }) {
  return <textarea className={cn(fieldBase, 'min-h-[120px] resize-y', className)} {...props} />
}
