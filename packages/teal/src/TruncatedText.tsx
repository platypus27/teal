import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from 'react'
import { cn } from './cn'

export interface TruncatedTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Maximum number of visible lines before the text clamps. */
  lines?: number
  /** Label for the button that collapses the text. */
  showLessLabel?: string
  /** Label for the button that expands the text. */
  showMoreLabel?: string
  /** The full text to display. */
  text: string
}

function clampStyle(lines: number): CSSProperties {
  if (lines <= 1) {
    return {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }
  }
  return {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
  }
}

export const TruncatedText = forwardRef<HTMLDivElement, TruncatedTextProps>(function TruncatedText(
  { className, lines = 1, showLessLabel = 'Show less', showMoreLabel = 'Show more', text, ...props },
  ref,
) {
  const [expanded, setExpanded] = useState(false)
  const [truncated, setTruncated] = useState(false)
  const textRef = useRef<HTMLSpanElement | null>(null)

  // Only measure while collapsed — the unclamped text never reports overflow.
  useLayoutEffect(() => {
    if (expanded) return
    const node = textRef.current
    if (!node) return

    function measure() {
      if (!node) return
      setTruncated(node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [text, lines, expanded])

  return (
    <div ref={ref} className={cn('teal-u-text-on-surface', className)} {...props}>
      <span ref={textRef} title={truncated && !expanded ? text : undefined} style={expanded ? undefined : clampStyle(lines)}>
        {text}
      </span>
      {truncated ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="teal-focus-ring teal-u-mt-1 teal-u-inline-block teal-u-rounded-lg teal-u-text-sm teal-u-font-bold teal-u-text-primary hover:teal-u-underline"
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      ) : null}
    </div>
  )
})
