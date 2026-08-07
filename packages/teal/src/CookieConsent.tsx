import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { Cookie } from 'lucide-react'
import { Button } from './Button'
import { cn } from './cn'

export interface CookieConsentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Label of the accept button. */
  acceptLabel?: string
  /** Label of the decline button. */
  declineLabel?: string
  /** Initial visibility when uncontrolled. */
  defaultOpen?: boolean
  /** Accessible name of the banner region. */
  label?: string
  /** URL of the cookie preferences page; renders a manage link when set. */
  manageHref?: string
  /** Label of the manage link. */
  manageLabel?: string
  /** Consent message, supplied sanitized by the caller. */
  message: ReactNode
  /** Called when the accept button is pressed; also dismisses the banner. */
  onAccept?: () => void
  /** Called when the decline button is pressed; also dismisses the banner. */
  onDecline?: () => void
  /** Called when the banner is shown or dismissed. */
  onOpenChange?: (open: boolean) => void
  /** Controlled visibility. */
  open?: boolean
}

/**
 * Polite, non-modal consent banner pinned to the bottom of the viewport.
 * Accept and decline both dismiss the banner; it never traps focus or
 * blocks interaction with the page behind it.
 */
export const CookieConsent = forwardRef<HTMLDivElement, CookieConsentProps>(function CookieConsent(
  {
    acceptLabel = 'Accept',
    className,
    declineLabel = 'Decline',
    defaultOpen = true,
    label = 'Cookie consent',
    manageHref,
    manageLabel = 'Manage preferences',
    message,
    onAccept,
    onDecline,
    onOpenChange,
    open,
    ...props
  },
  ref,
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const visible = open !== undefined ? open : internalOpen

  function dismiss() {
    if (open === undefined) setInternalOpen(false)
    onOpenChange?.(false)
  }

  if (!visible) return null

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      className={cn(
        'teal-u-fixed teal-u-inset-x-0 teal-u-bottom-0 teal-u-z-[var(--teal-z-overlay)] teal-u-p-3 sm:teal-u-p-4',
        className,
      )}
      {...props}
    >
      <div className="teal-raised-surface teal-u-mx-auto teal-u-flex teal-u-w-full teal-u-max-w-3xl teal-u-flex-col teal-u-gap-4 teal-u-border teal-u-bg-surface teal-u-p-4 teal-u-text-sm teal-u-text-on-surface sm:teal-u-flex-row sm:teal-u-items-center sm:teal-u-p-5">
        <Cookie aria-hidden="true" className="teal-u-hidden teal-u-size-[var(--teal-icon-lg)] teal-u-shrink-0 teal-u-text-on-surface-variant sm:teal-u-block" />
        <div className="teal-u-min-w-0 teal-u-flex-1 teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {message}
          {manageHref ? (
            <>
              {' '}
              <a
                href={manageHref}
                className="teal-focus-ring teal-u-rounded teal-u-font-medium teal-u-text-primary teal-u-no-underline hover:teal-u-underline"
              >
                {manageLabel}
              </a>
            </>
          ) : null}
        </div>
        <div className="teal-u-flex teal-u-shrink-0 teal-u-flex-col-reverse teal-u-gap-2 sm:teal-u-flex-row sm:teal-u-items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onDecline?.()
              dismiss()
            }}
          >
            {declineLabel}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onAccept?.()
              dismiss()
            }}
          >
            {acceptLabel}
          </Button>
        </div>
      </div>
    </div>
  )
})
