import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Actions rendered beside the title; wraps below on narrow screens. */
  actions?: ReactNode
  /** Supporting text rendered under the title. */
  subtitle?: ReactNode
  /** Page title rendered as a heading. */
  title: ReactNode
  /** Heading element used for the title; defaults to 'h1'. Adjust to fit the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { actions, children, className, subtitle, title, titleAs: TitleTag = 'h1', ...props },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
      {...props}
    >
      <div className="min-w-0">
        <TitleTag className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">{title}</TitleTag>
        {subtitle ? <p className="mt-2 text-base leading-relaxed text-on-surface-variant">{subtitle}</p> : null}
      </div>
      {actions ?? children ? <div className="flex flex-wrap items-center gap-2">{actions ?? children}</div> : null}
    </header>
  )
})
