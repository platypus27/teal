import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  actions?: ReactNode
  subtitle?: ReactNode
  title: ReactNode
}

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { actions, children, className, subtitle, title, ...props },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
      {...props}
    >
      <div className="min-w-0">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-base leading-relaxed text-on-surface-variant">{subtitle}</p> : null}
      </div>
      {actions ?? children ? <div className="flex flex-wrap items-center gap-2">{actions ?? children}</div> : null}
    </header>
  )
})
