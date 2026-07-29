import { forwardRef, useEffect, useState, type CSSProperties, type HTMLAttributes } from 'react'

const visuallyHidden: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
}

export interface AnnouncerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Text announced to screen readers; re-announced whenever it changes. */
  message: string
  /** Urgency of the live region. */
  politeness?: 'polite' | 'assertive'
}

export const Announcer = forwardRef<HTMLDivElement, AnnouncerProps>(function Announcer(
  { message, politeness = 'polite', style, ...props },
  ref,
) {
  const [announced, setAnnounced] = useState('')

  useEffect(() => {
    // Clear-then-set: the region is emptied before the message is written so
    // screen readers treat a repeated message as new content and re-announce it.
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(
      setTimeout(() => {
        setAnnounced('')
        if (message !== '') {
          timers.push(setTimeout(() => setAnnounced(message), 40))
        }
      }, 0),
    )
    return () => timers.forEach(clearTimeout)
  }, [message])

  return (
    <div
      ref={ref}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{ ...visuallyHidden, ...style }}
      {...props}
    >
      {announced}
    </div>
  )
})
