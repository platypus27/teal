import { forwardRef, useEffect, useRef, useState } from 'react'
import { Check, Link as LinkIcon, Share2 } from 'lucide-react'
import { Button } from './Button'
import { Popover } from './Popover'
import { VisuallyHidden } from './VisuallyHidden'

export interface ShareButtonProps {
  /** Feedback label shown briefly after the link is copied. */
  copiedLabel?: string
  className?: string
  /** Accessible name and visible text of the trigger button. */
  label?: string
  /** Visual style forwarded to the trigger button. */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Size forwarded to the trigger button. */
  size?: 'sm' | 'md' | 'lg'
  /** Text shared through the native share sheet. */
  text?: string
  /** Title shared through the native share sheet. */
  title?: string
  /** URL copied or shared. Defaults to the current page URL. */
  url?: string
}

/** Opens a popover with copy-link and, when available, native share actions. */
export const ShareButton = forwardRef<HTMLButtonElement, ShareButtonProps>(function ShareButton(
  { className, copiedLabel = 'Link copied', label = 'Share', size, text, title, url, variant = 'secondary' },
  ref,
) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    },
    [],
  )

  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // Clipboard access can be denied; still give feedback so the UI feels responsive.
    }
    setCopied(true)
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 1600)
  }

  const shareNatively = async () => {
    const data: ShareData = { url: shareUrl }
    if (text !== undefined) data.text = text
    if (title !== undefined) data.title = title
    try {
      await navigator.share(data)
      setOpen(false)
    } catch {
      // The user dismissed the share sheet; keep the popover open.
    }
  }

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        label={label}
        side="bottom"
        trigger={
          <Button ref={ref} variant={variant} size={size} className={className}>
            <Share2 aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
            {label}
          </Button>
        }
      >
        <div className="teal-u-flex teal-u-flex-col teal-u-gap-2">
          <Button variant="secondary" size="sm" onClick={copyLink}>
            {copied ? (
              <Check aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
            ) : (
              <LinkIcon aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
            )}
            {copied ? copiedLabel : 'Copy link'}
          </Button>
          {canNativeShare ? (
            <Button variant="ghost" size="sm" onClick={shareNatively}>
              <Share2 aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
              Share via…
            </Button>
          ) : null}
        </div>
      </Popover>
      <VisuallyHidden>
        <span aria-live="polite">{copied ? copiedLabel : ''}</span>
      </VisuallyHidden>
    </>
  )
})
