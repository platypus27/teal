export function Button({ children, variant = 'primary', className = '', as: Component = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
  const styles = {
    primary: 'bg-primary text-on-primary hover:opacity-90',
    secondary: 'border border-outline-variant/40 bg-surface-container text-on-surface hover:bg-surface-container-high',
    ghost: 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
  }
  return (
    <Component className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  )
}

export function IconButton({ children, className = '', title, ...props }) {
  return (
    <button
      type="button"
      title={title}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
