import { forwardRef, useMemo, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface HighlightTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Class applied to each `<mark>` around a match. */
  highlightClassName?: string
  /** Case-insensitive query to highlight. Empty highlights nothing. */
  query?: string
  /** The text to render. */
  text: string
}

interface TextPart {
  match: boolean
  text: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function splitOnQuery(text: string, query: string): TextPart[] {
  if (query === '') return [{ match: false, text }]
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  const parts: TextPart[] = []
  // Captured groups keep the matches in the split output at odd indexes.
  text.split(regex).forEach((part, index) => {
    if (part === '') return
    parts.push({ match: index % 2 === 1, text: part })
  })
  return parts
}

export const HighlightText = forwardRef<HTMLSpanElement, HighlightTextProps>(function HighlightText(
  { className, highlightClassName, query = '', text, ...props },
  ref,
) {
  const parts = useMemo(() => splitOnQuery(text, query), [text, query])

  return (
    <span ref={ref} className={cn(className)} {...props}>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            key={index}
            className={cn('teal-u-rounded-sm teal-u-bg-secondary-container teal-u-text-on-secondary-container', highlightClassName)}
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  )
})
