import { forwardRef, useSyncExternalStore, type ElementRef, type ReactNode } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export type ToastVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export interface ToastInput {
  action?: { label: string; onClick: () => void }
  description?: ReactNode
  duration?: number
  title: ReactNode
  variant?: ToastVariant
}

interface ToastRecord extends ToastInput {
  id: string
}

// Radix has no "never auto-dismiss"; ~68 years stands in for Infinity.
const PERSISTENT_TOAST_DURATION = 2_147_483_647

let nextToastId = 1
let records: ToastRecord[] = []
const emptyRecords: ToastRecord[] = []
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function toast(input: ToastInput) {
  const id = `teal-toast-${nextToastId++}`
  records = [...records, { ...input, id }]
  emit()
  return id
}

export function dismissToast(id: string) {
  records = records.filter((record) => record.id !== id)
  emit()
}

const variantStyles: Record<ToastVariant, { icon: typeof Info; className: string }> = {
  neutral: { icon: Info, className: 'text-on-surface-variant' },
  info: { icon: Info, className: 'text-primary' },
  success: { icon: CheckCircle2, className: 'text-tertiary' },
  warning: { icon: TriangleAlert, className: 'text-warning' },
  danger: { icon: CircleAlert, className: 'text-error' },
}

export const Toaster = forwardRef<ElementRef<typeof ToastPrimitive.Viewport>>(function Toaster(_props, ref) {
  const toasts = useSyncExternalStore(subscribe, () => records, () => emptyRecords)

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((item) => {
        const variant = variantStyles[item.variant ?? 'neutral']
        const VariantIcon = variant.icon
        return (
          <ToastPrimitive.Root
            key={item.id}
            open
            {...(item.duration !== undefined
              ? { duration: item.duration === Infinity ? PERSISTENT_TOAST_DURATION : item.duration }
              : {})}
            onOpenChange={(open) => {
              if (!open) dismissToast(item.id)
            }}
            className={cn(
              'grid w-[min(22rem,calc(100vw-2rem))] grid-cols-[auto_1fr_auto] items-start gap-x-3 rounded-xl border border-outline-variant/40 p-4 text-on-surface shadow-[var(--teal-shadow-overlay)]',
              'bg-surface-container',
            )}
          >
            <VariantIcon aria-hidden="true" className={cn('mt-0.5 size-5', variant.className)} />
            <div className="min-w-0">
              <ToastPrimitive.Title className="text-sm font-semibold">{item.title}</ToastPrimitive.Title>
              {item.description ? (
                <ToastPrimitive.Description className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                  {item.description}
                </ToastPrimitive.Description>
              ) : null}
              {item.action ? (
                <ToastPrimitive.Action asChild altText={item.action.label}>
                  <button
                    type="button"
                    onClick={item.action.onClick}
                    className="mt-2 text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.action.label}
                  </button>
                </ToastPrimitive.Action>
              ) : null}
            </div>
            <ToastPrimitive.Close asChild>
              <IconButton label="Dismiss notification" size="sm" className="-mr-2 -mt-2">
                <X />
              </IconButton>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        )
      })}
      <ToastPrimitive.Viewport
        ref={ref}
        className="fixed bottom-0 right-0 z-[var(--teal-z-toast)] flex max-h-screen w-full flex-col items-end gap-2 p-4 sm:w-auto"
      />
    </ToastPrimitive.Provider>
  )
})
