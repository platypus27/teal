import { forwardRef, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button, type ButtonProps } from './Button'
import { cn } from './cn'
import { Menu, type MenuItem } from './Menu'

export interface SplitButtonProps {
  className?: string
  /** Disables both the main action and the menu trigger. */
  disabled?: boolean
  /** Secondary actions rendered in the attached menu. */
  items: MenuItem[]
  /** Content of the main action button. */
  label: ReactNode
  /** Accessible label for the menu trigger button and the menu itself. */
  menuLabel?: string
  /** Called when the main action is clicked. */
  onClick: () => void
  /** Size of both buttons. */
  size?: ButtonProps['size']
  /** Color treatment shared by both buttons. */
  variant?: 'primary' | 'secondary' | 'danger'
}

/**
 * A primary action button with an attached menu trigger for related secondary
 * actions, joined into a single pill with a hairline seam.
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  { className, disabled = false, items, label, menuLabel = 'More actions', onClick, size, variant = 'primary' },
  ref,
) {
  return (
    <div ref={ref} className={cn('teal-u-inline-flex -teal-u-space-x-px', className)}>
      <Button
        variant={variant}
        {...(size !== undefined ? { size } : {})}
        disabled={disabled}
        onClick={onClick}
        className="teal-u-rounded-r-none"
      >
        {label}
      </Button>
      <Menu
        align="end"
        items={items}
        label={menuLabel}
        trigger={
          <Button
            variant={variant}
            {...(size !== undefined ? { size } : {})}
            disabled={disabled}
            aria-label={menuLabel}
            className="teal-u-rounded-l-none teal-u-px-2.5"
          >
            <ChevronDown aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
          </Button>
        }
      />
    </div>
  )
})
