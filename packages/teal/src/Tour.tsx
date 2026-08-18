import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type ReactNode,
} from 'react'
import { Button } from './Button'
import { Portal } from './Portal'
import { cn } from './cn'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export interface TourStep {
  /** CSS selector of the element this step points at. */
  target: string
  /** Step heading. */
  title: ReactNode
  /** Step body content. */
  content: ReactNode
  /** Side of the target the popover appears on; defaults to 'bottom'. */
  placement?: 'top' | 'bottom'
}

export interface TourProps {
  /** Ordered walkthrough steps. */
  steps: TourStep[]
  /** Controls whether the tour is visible. */
  open: boolean
  /** Called when the tour closes via Skip, Done or Escape. */
  onOpenChange: (open: boolean) => void
  /** Called after the final step completes. */
  onFinish?: () => void
}

interface PopoverPosition {
  top: number
  left: number
  centered: boolean
}

interface HighlightRect {
  top: number
  left: number
  width: number
  height: number
}

const POPOVER_WIDTH = 320
const POPOVER_GAP = 12

/** Guided onboarding walkthrough that highlights target elements step by step. */
export const Tour = forwardRef<HTMLDivElement, TourProps>(function Tour(
  { onFinish, onOpenChange, open, steps },
  ref,
) {
  const titleId = useId()
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState<PopoverPosition>({ top: 0, left: 0, centered: true })
  const [highlight, setHighlight] = useState<HighlightRect | null>(null)

  useEffect(() => {
    if (open) setIndex(0)
  }, [open])

  const step = steps[index]

  const updatePosition = useCallback(() => {
    if (!step) return
    const target = document.querySelector(step.target)
    if (!target) {
      // Target is not in the DOM; fall back to a centered popover without a highlight.
      setHighlight(null)
      setPosition({ top: 0, left: 0, centered: true })
      return
    }
    const rect = target.getBoundingClientRect()
    setHighlight({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
    setPosition({
      top: step.placement === 'top' ? rect.top - POPOVER_GAP : rect.bottom + POPOVER_GAP,
      left: clamp(rect.left, 16, Math.max(16, window.innerWidth - POPOVER_WIDTH - 16)),
      centered: false,
    })
  }, [step])

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open || !step) return
    const target = document.querySelector(step.target)
    target?.scrollIntoView?.({ block: 'nearest' })
  }, [open, step])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  if (!open || !step) return null

  const isFirst = index === 0
  const isLast = index === steps.length - 1

  const goNext = () => {
    if (isLast) {
      onFinish?.()
      onOpenChange(false)
    } else {
      setIndex(index + 1)
    }
  }

  return (
    // Portaled to document.body so viewport coordinates from
    // getBoundingClientRect stay correct inside transformed ancestors.
    <Portal>
      {highlight ? (
        <div
          aria-hidden="true"
          className="teal-u-pointer-events-none teal-u-fixed teal-u-z-[var(--teal-z-overlay)] teal-u-rounded-lg"
          style={{
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
            boxShadow: '0 0 0 2px var(--teal-color-primary)',
          }}
        />
      ) : null}
      <div
        ref={ref}
        role="dialog"
        aria-labelledby={titleId}
        className={cn(
          'teal-overlay-surface teal-u-fixed teal-u-z-[var(--teal-z-popover)] teal-u-w-80 teal-u-border teal-u-bg-surface teal-u-p-4 teal-u-text-on-surface',
          position.centered && 'teal-u-left-1/2 teal-u-top-1/2 -teal-u-translate-x-1/2 -teal-u-translate-y-1/2',
          !position.centered && step.placement === 'top' && '-teal-u-translate-y-full',
        )}
        style={position.centered ? undefined : { top: position.top, left: position.left, width: POPOVER_WIDTH }}
      >
        <div id={titleId} className="teal-u-font-headline teal-u-text-base teal-u-font-bold">
          {step.title}
        </div>
        <div className="teal-u-mt-1 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
          {step.content}
        </div>
        <div className="teal-u-mt-4 teal-u-flex teal-u-items-center teal-u-gap-2">
          <span className="teal-u-text-xs teal-u-text-on-surface-variant">
            Step {index + 1} of {steps.length}
          </span>
          <div className="teal-u-ml-auto teal-u-flex teal-u-gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Skip
            </Button>
            <Button variant="secondary" size="sm" disabled={isFirst} onClick={() => setIndex(index - 1)}>
              Back
            </Button>
            <Button size="sm" onClick={goNext}>
              {isLast ? 'Done' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  )
})
