export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-outline-variant bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 ${className}`}
      {...props}
    />
  )
}

export function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full rounded-xl border border-outline-variant bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function TextArea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-outline-variant bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 ${className}`}
      {...props}
    />
  )
}
