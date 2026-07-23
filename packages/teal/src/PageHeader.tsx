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
      className={cn('teal-u-mb-6 teal-u-flex teal-u-flex-col teal-u-gap-4 sm:teal-u-flex-row sm:teal-u-items-end sm:teal-u-justify-between', className)}
      {...props}
    >
      <div className="teal-u-min-w-0">
        <TitleTag className="teal-u-font-headline teal-u-text-3xl teal-u-font-extrabold teal-u-tracking-tight teal-u-text-on-surface md:teal-u-text-4xl">{title}</TitleTag>
        {subtitle ? <p className="teal-u-mt-2 teal-u-text-base teal-u-leading-relaxed teal-u-text-on-surface-variant">{subtitle}</p> : null}
      </div>
      {actions ?? children ? <div className="teal-u-flex teal-u-flex-wrap teal-u-items-center teal-u-gap-2">{actions ?? children}</div> : null}
    </header>
  )
})
