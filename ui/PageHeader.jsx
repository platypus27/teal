import { cn } from './cn.js'

export function PageHeader({ title, subtitle, children, className = '' }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-base text-on-surface-variant">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
