import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import { WifiOff, X } from 'lucide-react'
import { cn } from './cn'

export interface OfflineBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Message shown inside the banner. */
  message?: string
  /** Accessible label for the dismiss button. */
  dismissLabel?: string
  /** Called when the banner is dismissed. */
  onDismiss?: () => void
}

export const OfflineBanner = forwardRef<HTMLDivElement, OfflineBannerProps>(function OfflineBanner(
  {
    className,
    dismissLabel = 'Dismiss offline notification',
    message = 'You are offline. Changes may not be saved until the connection returns.',
    onDismiss,
    ...props
  },
  ref,
) {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => {
      setOnline(false)
      setDismissed(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  function dismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  if (online || dismissed) return null

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn(
        'teal-u-fixed teal-u-inset-x-0 teal-u-top-0 teal-u-z-50 teal-u-flex teal-u-items-center teal-u-justify-center teal-u-gap-2 teal-u-border-b teal-u-border-solid teal-u-border-[color:color-mix(in_srgb,var(--teal-color-warning)_45%,var(--teal-color-surface))] teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-warning)_14%,var(--teal-color-surface))] teal-u-px-4 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface',
        className,
      )}
      {...props}
    >
      <WifiOff aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0 teal-u-text-warning" />
      <span>{message}</span>
      <button
        type="button"
        aria-label={dismissLabel}
        onClick={dismiss}
        className="teal-focus-ring teal-u-ml-2 teal-u-inline-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-p-1 teal-u-text-on-surface-variant hover:teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-warning)_25%,var(--teal-color-surface))]"
      >
        <X aria-hidden="true" className="teal-u-size-3.5" strokeWidth={2.5} />
      </button>
    </div>
  )
})
