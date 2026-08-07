import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from './cn'
import { Collapse } from './Collapse'

export interface ExpandableCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onChange' | 'defaultValue'> {
  /** Content revealed when the card is expanded; hidden and inert while collapsed. */
  children?: ReactNode
  /** Accessible label of the trigger when expanded. */
  collapseLabel?: string
  /** Initially expanded state when uncontrolled. */
  defaultExpanded?: boolean
  /** Accessible label of the trigger when collapsed. */
  expandLabel?: string
  /** Controlled expanded state. */
  expanded?: boolean
  /** Called with the next expanded state when the trigger is pressed. */
  onExpandedChange?: (expanded: boolean) => void
  /** Title rendered in the always-visible header next to the trigger. */
  title?: ReactNode
  /** Heading element used for the title; defaults to 'h2'. Adjust to fit the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const ExpandableCard = forwardRef<HTMLDivElement, ExpandableCardProps>(function ExpandableCard(
  {
    children,
    className,
    collapseLabel = 'Show less',
    defaultExpanded = false,
    expandLabel = 'Show more',
    expanded,
    onExpandedChange,
    title,
    titleAs: TitleTag = 'h2',
    ...props
  },
  ref,
) {
  const regionId = useId()
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isExpanded = expanded !== undefined ? expanded : internalExpanded

  function toggle() {
    if (expanded === undefined) setInternalExpanded(!isExpanded)
    onExpandedChange?.(!isExpanded)
  }

  return (
    <div
      ref={ref}
      className={cn('teal-raised-surface teal-u-border teal-u-bg-surface-container teal-u-p-6', className)}
      {...props}
    >
      <div className="teal-u-flex teal-u-items-center teal-u-justify-between teal-u-gap-3">
        {title !== undefined && title !== null ? (
          <TitleTag className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
            {title}
          </TitleTag>
        ) : null}
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={regionId}
          onClick={toggle}
          className="teal-focus-ring teal-u-ms-auto teal-u-inline-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-full teal-u-px-3 teal-u-py-1.5 teal-u-text-sm teal-u-font-semibold teal-u-text-primary hover:teal-u-bg-primary/10"
        >
          {isExpanded ? collapseLabel : expandLabel}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'teal-u-size-4 teal-u-transition-transform teal-u-duration-[var(--teal-motion-standard)] motion-reduce:teal-u-transition-none',
              isExpanded && 'teal-u-rotate-180',
            )}
          />
        </button>
      </div>
      <Collapse id={regionId} open={isExpanded}>
        <div className="teal-u-pt-4">{children}</div>
      </Collapse>
    </div>
  )
})
