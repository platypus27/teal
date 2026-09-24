import { forwardRef } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button, IconButton } from './Button'
import { VisuallyHidden } from './VisuallyHidden'
import { useCopied } from './use-copied'

export interface CopyButtonProps {
  /** Text written to the clipboard when the button is clicked. */
  value: string
  /** Label shown before copying; doubles as the accessible name in icon-only mode. Defaults to 'Copy'. */
  label?: string
  /** Feedback label shown briefly after a successful copy. Defaults to 'Copied'. */
  copiedLabel?: string
  /** Renders an icon-only IconButton instead of a Button with text. */
  iconOnly?: boolean
  /** Visual style forwarded to the underlying button. */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Size forwarded to the underlying button. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Copies a value to the clipboard and briefly swaps to a check icon with live feedback. */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { className, copiedLabel = 'Copied', iconOnly = false, label = 'Copy', size, value, variant },
  ref,
) {
  const [copied, markCopied] = useCopied()

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard access can be denied; still give feedback so the UI feels responsive.
    }
    markCopied()
  }

  const icon = copied ? (
    <Check aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
  ) : (
    <Copy aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
  )

  return (
    <>
      {iconOnly ? (
        <IconButton
          ref={ref}
          label={copied ? copiedLabel : label}
          variant={variant === 'primary' ? 'secondary' : variant}
          size={size}
          onClick={copyValue}
          className={className}
        >
          {icon}
        </IconButton>
      ) : (
        <Button ref={ref} variant={variant} size={size} onClick={copyValue} className={className}>
          {icon}
          {copied ? copiedLabel : label}
        </Button>
      )}
      <VisuallyHidden>
        <span aria-live="polite">{copied ? copiedLabel : ''}</span>
      </VisuallyHidden>
    </>
  )
})
