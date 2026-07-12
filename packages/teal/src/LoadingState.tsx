import { LoaderCircle } from 'lucide-react'
import { forwardRef, type HTMLAttributes } from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from './cn'
import { glassSurface } from './glass'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Accessible label announced by screen readers. */
  label?: string
  /** Diameter of the spinner. */
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, label = 'Loading', size = 'md', ...props },
  ref,
) {
  return (
    <span ref={ref} role="status" aria-label={label} className={cn('inline-flex text-primary', className)} {...props}>
      <LoaderCircle
        aria-hidden="true"
        className={cn(
          'animate-spin motion-reduce:animate-none',
          size === 'sm' && 'size-4',
          size === 'md' && 'size-6',
          size === 'lg' && 'size-8',
        )}
      />
    </span>
  )
})

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Renders a translucent, blurred surface instead of an opaque panel. */
  glass?: boolean
  /** Accessible label announced by screen readers while the region is loading. */
  label?: string
}

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(function LoadingState(
  { className, glass = false, label = 'Loading', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(
        'flex min-h-60 items-center justify-center rounded-2xl border border-outline-variant/20',
        glass ? glassSurface : 'bg-surface-container',
        className,
      )}
      {...props}
    >
      <LoaderCircle aria-hidden="true" className="size-8 animate-spin text-primary motion-reduce:animate-none" />
    </div>
  )
})

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-surface-container-high motion-reduce:animate-none', className)}
      {...props}
    />
  )
})

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Accessible label describing what the progress bar measures. */
  label: string
}

export const Progress = forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(function Progress(
  { className, label, max = 100, value = 0, ...props },
  ref,
) {
  const percentage = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100))
  return (
    <ProgressPrimitive.Root
      ref={ref}
      aria-label={label}
      max={max}
      value={value}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-surface-container-high', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full bg-primary transition-transform motion-reduce:transition-none"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
