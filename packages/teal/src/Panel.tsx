import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Action elements rendered on the trailing side of the header. */
  actions?: ReactNode
  /** Title rendered in the header; omit to render the panel without a header. */
  title?: ReactNode
  /** Heading element used for the title; defaults to 'h2'. Adjust to fit the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { actions, children, className, title, titleAs: TitleTag = 'h2', ...props },
  ref,
) {
  const hasHeader = title !== undefined && title !== null
  return (
    <div
      ref={ref}
      className={cn(
        'teal-u-rounded-2xl teal-u-border teal-u-border-outline-variant/30 teal-u-bg-surface-container teal-u-p-4',
        className,
      )}
      {...props}
    >
      {hasHeader || actions ? (
        <div className="teal-u-mb-3 teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-3">
          {hasHeader ? (
            <TitleTag className="teal-u-font-headline teal-u-text-base teal-u-font-semibold teal-u-text-on-surface">
              {title}
            </TitleTag>
          ) : null}
          {actions ? <div className="teal-u-ms-auto teal-u-flex teal-u-items-center teal-u-gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
})
