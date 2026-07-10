export function Card({ children, className = '', hover = false, as: Component = 'div', ...props }) {
  return (
    <Component
      className={`rounded-[1.5rem] border border-outline-variant/10 bg-surface-container p-6 shadow-[0_4px_28px_-10px_rgba(0,100,102,0.12)] ${hover ? 'transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_32px_-10px_rgba(0,100,102,0.18)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 flex items-center justify-between ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h2 className={`text-lg font-bold text-on-surface ${className}`}>{children}</h2>
}

export function CardSubtitle({ children, className = '' }) {
  return <p className={`text-xs text-on-surface-variant ${className}`}>{children}</p>
}
