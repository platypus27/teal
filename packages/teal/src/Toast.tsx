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
  neutral: { icon: Info, className: 'teal-u-text-on-surface-variant' },
  info: { icon: Info, className: 'teal-u-text-primary' },
  success: { icon: CheckCircle2, className: 'teal-u-text-tertiary' },
  warning: { icon: TriangleAlert, className: 'teal-u-text-warning' },
  danger: { icon: CircleAlert, className: 'teal-u-text-error' },
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
              'teal-overlay-surface teal-u-grid teal-u-w-[min(22rem,calc(100vw-2rem))] teal-u-grid-cols-[auto_1fr_auto] teal-u-items-start teal-u-gap-x-3 teal-u-border teal-u-p-4 teal-u-text-on-surface',
              'teal-u-bg-surface',
            )}
          >
            <VariantIcon aria-hidden="true" className={cn('teal-u-mt-0.5 teal-u-size-[var(--teal-icon-md)]', variant.className)} />
            <div className="teal-u-min-w-0">
              <ToastPrimitive.Title className="teal-u-text-sm teal-u-font-semibold">{item.title}</ToastPrimitive.Title>
              {item.description ? (
                <ToastPrimitive.Description className="teal-u-mt-1 teal-u-text-xs teal-u-leading-relaxed teal-u-text-on-surface-variant">
                  {item.description}
                </ToastPrimitive.Description>
              ) : null}
              {item.action ? (
                <ToastPrimitive.Action asChild altText={item.action.label}>
                  <button
                    type="button"
                    onClick={item.action.onClick}
                    className="teal-focus-ring teal-u-mt-2 teal-u-rounded teal-u-text-xs teal-u-font-bold teal-u-text-primary hover:teal-u-underline"
                  >
                    {item.action.label}
                  </button>
                </ToastPrimitive.Action>
              ) : null}
            </div>
            <ToastPrimitive.Close asChild>
              <IconButton label="Dismiss notification" size="sm" className="-teal-u-mr-2 -teal-u-mt-2">
                <X />
              </IconButton>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        )
      })}
      <ToastPrimitive.Viewport
        ref={ref}
        className="teal-u-fixed teal-u-bottom-0 teal-u-right-0 teal-u-z-[var(--teal-z-toast)] teal-u-flex teal-u-max-h-screen teal-u-w-full teal-u-flex-col teal-u-items-end teal-u-gap-2 teal-u-p-4 sm:teal-u-w-auto"
      />
    </ToastPrimitive.Provider>
  )
})
