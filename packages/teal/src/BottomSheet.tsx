import { forwardRef, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { VisuallyHidden } from './VisuallyHidden'
import { cn } from './cn'

const snapClasses = {
  half: 'teal-u-max-h-[50dvh]',
  full: 'teal-u-h-[calc(100dvh-1.5rem)] teal-u-max-h-[calc(100dvh-1.5rem)]',
}

export interface BottomSheetProps {
  /** Body content of the sheet. */
  children: ReactNode
  className?: string
  /** Accessible label for the close button. */
  closeLabel?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Supporting text rendered under the title. */
  description?: ReactNode
  /** Action area rendered at the bottom of the sheet. */
  footer?: ReactNode
  /** Called when the sheet opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Height the sheet snaps to. */
  snap?: 'half' | 'full'
  /** Title rendered at the top; also the accessible name of the sheet. */
  title?: ReactNode
}

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(function BottomSheet(
  {
    children,
    className,
    closeLabel = 'Close',
    defaultOpen,
    description,
    footer,
    onOpenChange,
    open,
    snap = 'half',
    title,
  },
  ref,
) {
  return (
    <DialogPrimitive.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="teal-dialog-overlay teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-overlay)] teal-u-bg-black/50 teal-u-backdrop-blur-sm" />
        <DialogPrimitive.Content
          ref={ref}
          data-snap={snap}
          className={cn(
            'teal-bottom-sheet-content teal-u-fixed teal-u-bottom-0 teal-u-left-1/2 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-w-full teal-u-max-w-xl -teal-u-translate-x-1/2 teal-u-flex-col teal-u-rounded-t-2xl teal-u-border teal-u-border-b-0 teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-shadow-overlay teal-u-text-on-surface teal-u-outline-none',
            snapClasses[snap],
            className,
          )}
        >
          <div aria-hidden="true" className="teal-u-flex teal-u-shrink-0 teal-u-justify-center teal-u-pb-1 teal-u-pt-3">
            <span className="teal-u-h-1.5 teal-u-w-10 teal-u-rounded-full teal-u-bg-surface-container-high" />
          </div>
          {title || description ? (
            <div className="teal-u-shrink-0 teal-u-p-6 teal-u-pr-14 teal-u-pt-3">
              {title ? (
                <DialogPrimitive.Title className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
                  {title}
                </DialogPrimitive.Title>
              ) : null}
              {description ? (
                <DialogPrimitive.Description className="teal-u-mt-2 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
          ) : (
            <DialogPrimitive.Title asChild>
              <VisuallyHidden>Bottom sheet</VisuallyHidden>
            </DialogPrimitive.Title>
          )}
          <DialogPrimitive.Close asChild>
            <IconButton label={closeLabel} size="sm" className="teal-u-absolute teal-u-right-4 teal-u-top-4">
              <X />
            </IconButton>
          </DialogPrimitive.Close>
          <div className="teal-u-flex-1 teal-u-overflow-y-auto teal-u-px-6 teal-u-py-4">{children}</div>
          {footer ? (
            <div className="teal-u-flex teal-u-shrink-0 teal-u-flex-col-reverse teal-u-gap-2 teal-u-border-t teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-6 sm:teal-u-flex-row sm:teal-u-justify-end">
              {footer}
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})
