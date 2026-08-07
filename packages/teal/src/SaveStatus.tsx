import { forwardRef, type HTMLAttributes } from 'react'
import { Check, CircleAlert, LoaderCircle } from 'lucide-react'
import { cn } from './cn'

export type SaveStatusState = 'saved' | 'saving' | 'error'

const statusConfig = {
  saved: { icon: Check, text: 'Saved', iconClassName: 'teal-u-text-tertiary' },
  saving: { icon: LoaderCircle, text: 'Saving…', iconClassName: 'teal-u-text-primary' },
  error: { icon: CircleAlert, text: 'Save failed', iconClassName: 'teal-u-text-error' },
}

function defaultFormatSavedAt(date: Date): string {
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000))
  if (seconds < 45) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  return `${Math.round(hours / 24)} d ago`
}

export interface SaveStatusProps extends HTMLAttributes<HTMLSpanElement> {
  /** Current persistence state. */
  status?: SaveStatusState
  /** When the last save completed; rendered as relative text after the "Saved" label. */
  savedAt?: Date
  /** Formats `savedAt` into relative text. */
  formatSavedAt?: (date: Date) => string
}

export const SaveStatus = forwardRef<HTMLSpanElement, SaveStatusProps>(function SaveStatus(
  { className, formatSavedAt = defaultFormatSavedAt, savedAt, status = 'saved', ...props },
  ref,
) {
  const { icon: Icon, text, iconClassName } = statusConfig[status]
  return (
    <span
      ref={ref}
      role="status"
      className={cn('teal-u-inline-flex teal-u-items-center teal-u-gap-1.5 teal-u-text-sm teal-u-text-on-surface-variant', className)}
      {...props}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          'teal-u-size-[var(--teal-icon-sm)] teal-u-shrink-0',
          iconClassName,
          status === 'saving' && 'teal-u-animate-spin motion-reduce:teal-u-animate-none',
        )}
      />
      <span>
        {text}
        {status === 'saved' && savedAt ? ` · ${formatSavedAt(savedAt)}` : ''}
      </span>
    </span>
  )
})
