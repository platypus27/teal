import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { cn } from './cn'

export interface NetworkStatusProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Render prop receiving the current online state for fully custom output. */
  children?: (online: boolean) => ReactNode
  /** Text shown while the browser is online. */
  onlineLabel?: string
  /** Text shown while the browser is offline. */
  offlineLabel?: string
}

export const NetworkStatus = forwardRef<HTMLDivElement, NetworkStatusProps>(function NetworkStatus(
  { children, className, offlineLabel = 'Offline', onlineLabel = 'Online', ...props },
  ref,
) {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (children) return <>{children(online)}</>

  const Icon = online ? Wifi : WifiOff
  return (
    <div
      ref={ref}
      className={cn(
        'teal-u-inline-flex teal-u-items-center teal-u-gap-1.5 teal-u-text-sm teal-u-font-semibold',
        online ? 'teal-u-text-tertiary' : 'teal-u-text-error',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
      <span>{online ? onlineLabel : offlineLabel}</span>
    </div>
  )
})
