import { forwardRef, type ReactNode, type RefObject } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { VisuallyHidden } from './VisuallyHidden'
import { cn } from './cn'

const snapClasses = {
  half: 'teal-u-max-h-[50dvh]',
  full: 'teal-u-h-[calc(100dvh-1.5rem)] teal-u-max-h-[calc(100dvh-1.5rem)]',
}

export interface DialogProps {
  /** Body content of the dialog. */
  children: ReactNode
  className?: string
  /** Accessible label for the close button. */
  closeLabel?: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Supporting text rendered under the title. */
  description?: ReactNode
  /** Action area rendered at the bottom of the dialog. */
  footer?: ReactNode
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Where the dialog surface is placed: centered modal, fullscreen, a left/right drawer edge, or a bottom sheet. */
  placement?: 'center' | 'fullscreen' | 'left' | 'right' | 'bottom'
  /** Element that receives focus after a controlled dialog closes. */
  restoreFocusRef?: RefObject<HTMLElement | null>
  /** Width of the dialog surface (placement="center" only). */
  size?: 'sm' | 'md' | 'lg'
  /** Height the sheet snaps to (placement="bottom" only). */
  snap?: 'half' | 'full'
  /** Title rendered at the top; also the accessible name of the dialog. */
  title?: ReactNode
  /** Width of the drawer surface (placement="left" or "right" only). */
  width?: string
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    children,
    className,
    closeLabel = 'Close',
    defaultOpen,
    description,
    footer,
    onOpenChange,
    open,
    placement = 'center',
    restoreFocusRef,
    size = 'md',
    snap = 'half',
    title,
    width = 'min(28rem,calc(100vw - 1.5rem))',
  },
  ref,
) {
  const isCenter = placement === 'center'
  const isFullscreen = placement === 'fullscreen'
  const isDrawer = placement === 'left' || placement === 'right'
  const isBottom = placement === 'bottom'

  const fallbackTitle = !title && !description ? (
    <DialogPrimitive.Title asChild>
      <VisuallyHidden>Dialog</VisuallyHidden>
    </DialogPrimitive.Title>
  ) : null

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
          onCloseAutoFocus={restoreFocusRef ? (event) => {
            event.preventDefault()
            restoreFocusRef.current?.focus()
          } : undefined}
          {...(isDrawer ? { 'data-side': placement } : {})}
          {...(isBottom ? { 'data-snap': snap } : {})}
          {...(isDrawer ? { style: { width } } : {})}
          className={cn(
            isCenter &&
              'teal-dialog-content teal-overlay-surface teal-u-fixed teal-u-left-1/2 teal-u-top-1/2 teal-u-z-[var(--teal-z-dialog)] teal-u-max-h-[calc(100vh-2rem)] teal-u-w-[calc(100%-2rem)] -teal-u-translate-x-1/2 -teal-u-translate-y-1/2 teal-u-overflow-y-auto teal-u-border teal-u-bg-surface teal-u-p-6 teal-u-text-on-surface teal-u-outline-none',
            isCenter && size === 'sm' && 'teal-u-max-w-sm',
            isCenter && size === 'md' && 'teal-u-max-w-lg',
            isCenter && size === 'lg' && 'teal-u-max-w-2xl',
            isFullscreen &&
              'teal-dialog-content teal-u-fixed teal-u-inset-0 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-h-dvh teal-u-w-full teal-u-flex-col teal-u-bg-surface teal-u-text-on-surface teal-u-outline-none',
            isDrawer &&
              'teal-drawer-content teal-u-fixed teal-u-inset-y-3 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-flex-col teal-u-rounded-xl teal-u-border teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-shadow-overlay teal-u-text-on-surface teal-u-outline-none',
            isDrawer && (placement === 'right' ? 'teal-u-right-3' : 'teal-u-left-3'),
            isBottom &&
              'teal-bottom-sheet-content teal-u-fixed teal-u-bottom-0 teal-u-left-1/2 teal-u-z-[var(--teal-z-dialog)] teal-u-flex teal-u-w-full teal-u-max-w-xl -teal-u-translate-x-1/2 teal-u-flex-col teal-u-rounded-t-2xl teal-u-border teal-u-border-b-0 teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-shadow-overlay teal-u-text-on-surface teal-u-outline-none',
            isBottom && snapClasses[snap],
            className,
          )}
        >
          {isFullscreen ? (
            <>
              <div className="teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-between teal-u-gap-4 teal-u-border-b teal-u-border-[color:var(--teal-border-subtle)] teal-u-py-4 teal-u-pl-6 teal-u-pr-4">
                <div>
                  {title ? (
                    <DialogPrimitive.Title className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
                      {title}
                    </DialogPrimitive.Title>
                  ) : (
                    fallbackTitle
                  )}
                  {description ? (
                    <DialogPrimitive.Description className="teal-u-mt-1 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
                      {description}
                    </DialogPrimitive.Description>
                  ) : null}
                </div>
                <DialogPrimitive.Close asChild>
                  <IconButton label={closeLabel}>
                    <X />
                  </IconButton>
                </DialogPrimitive.Close>
              </div>
              <div className="teal-u-flex-1 teal-u-overflow-y-auto teal-u-p-6">{children}</div>
              {footer ? (
                <div className="teal-u-flex teal-u-shrink-0 teal-u-flex-col-reverse teal-u-gap-2 teal-u-border-t teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-6 sm:teal-u-flex-row sm:teal-u-justify-end">
                  {footer}
                </div>
              ) : null}
            </>
          ) : (
            <>
              {isBottom ? (
                <div aria-hidden="true" className="teal-u-flex teal-u-shrink-0 teal-u-justify-center teal-u-pb-1 teal-u-pt-3">
                  <span className="teal-u-h-1.5 teal-u-w-10 teal-u-rounded-full teal-u-bg-surface-container-high" />
                </div>
              ) : null}
              {isBottom && !title && !description ? (
                fallbackTitle
              ) : (
                <div
                  className={cn(
                    isCenter && 'teal-u-pr-10',
                    isDrawer && 'teal-u-border-b teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-6 teal-u-pr-14',
                    isBottom && 'teal-u-shrink-0 teal-u-p-6 teal-u-pr-14 teal-u-pt-3',
                  )}
                >
                  {title ? (
                    <DialogPrimitive.Title className="teal-u-font-headline teal-u-text-lg teal-u-font-bold teal-u-text-on-surface">
                      {title}
                    </DialogPrimitive.Title>
                  ) : (
                    fallbackTitle
                  )}
                  {description ? (
                    <DialogPrimitive.Description className="teal-u-mt-2 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
                      {description}
                    </DialogPrimitive.Description>
                  ) : null}
                </div>
              )}
              <DialogPrimitive.Close asChild>
                <IconButton label={closeLabel} size="sm" className="teal-u-absolute teal-u-right-4 teal-u-top-4">
                  <X />
                </IconButton>
              </DialogPrimitive.Close>
              <div
                className={cn(
                  isCenter && 'teal-u-mt-5',
                  isDrawer && 'teal-u-flex-1 teal-u-overflow-y-auto teal-u-px-6 teal-u-py-5',
                  isBottom && 'teal-u-flex-1 teal-u-overflow-y-auto teal-u-px-6 teal-u-py-4',
                )}
              >
                {children}
              </div>
              {footer ? (
                <div
                  className={cn(
                    'teal-u-flex teal-u-flex-col-reverse teal-u-gap-2 sm:teal-u-flex-row sm:teal-u-justify-end',
                    isCenter && 'teal-u-mt-6',
                    (isDrawer || isBottom) &&
                      'teal-u-border-t teal-u-border-[color:var(--teal-border-subtle)] teal-u-p-6',
                    isBottom && 'teal-u-shrink-0',
                  )}
                >
                  {footer}
                </div>
              ) : null}
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})
