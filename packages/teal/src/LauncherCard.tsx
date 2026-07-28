import { forwardRef, type ReactNode } from 'react'
import { Card } from './Card'
import { cn } from './cn'

export interface LauncherCardProps {
  className?: string
  /** Short supporting line shown under the label. */
  description?: ReactNode
  /** Renders the card unavailable and blocks navigation. */
  disabled?: boolean
  /** URL the card navigates to. */
  href: string
  /** Icon rendered beside the label. */
  icon?: ReactNode
  /** Visible application label. */
  label: ReactNode
  /** Status content rendered below the description, such as a health Badge. */
  status?: ReactNode
}

export const LauncherCard = forwardRef<HTMLAnchorElement, LauncherCardProps>(function LauncherCard(
  { className, description, disabled = false, href, icon, label, status },
  ref,
) {
  return (
    <Card
      as="a"
      ref={ref}
      href={href}
      disabled={disabled}
      className={cn('teal-u-block teal-u-no-underline', className)}
    >
      <span className="teal-u-flex teal-u-items-center teal-u-gap-3">
        {icon ? (
          <span className="teal-u-shrink-0 teal-u-text-on-surface-variant [&_svg]:teal-u-size-[var(--teal-icon-lg)]">
            {icon}
          </span>
        ) : null}
        <span className="teal-u-min-w-0">
          <span className="teal-u-block teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
            {label}
          </span>
          {description ? (
            <span className="teal-u-mt-1 teal-u-block teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
              {description}
            </span>
          ) : null}
        </span>
      </span>
      {status ? <span className="teal-u-mt-4 teal-u-flex teal-u-items-center teal-u-gap-2">{status}</span> : null}
    </Card>
  )
})
