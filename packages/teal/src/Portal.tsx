import { useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  /** Element to render into. Defaults to `document.body`. */
  container?: Element | DocumentFragment | null
  /** Content rendered inside the portal. */
  children?: ReactNode
}

// Never subscribes to anything; it only distinguishes client from server.
const subscribe = () => () => {}

// No forwardRef here: the portal renders into a foreign container, so there is
// no owned DOM node to hand back.
export function Portal({ container, children }: PortalProps) {
  // Wait for the client mount so SSR never touches `document`.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  if (!mounted) return null

  return createPortal(children, container ?? document.body)
}
