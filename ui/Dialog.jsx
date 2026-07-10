import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from './cn.js'

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function Dialog({ open, onOpenChange, children, className = '' }) {
  const panelRef = useRef(null)
  const lastFocused = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!open) {
      setShow(false)
      return
    }
    const id = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e) {
      if (e.key === 'Escape') onOpenChange?.(false)
      if (e.key === 'Tab') {
        const nodes = panelRef.current?.querySelectorAll(FOCUSABLE)
        if (!nodes || nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector(FOCUSABLE)
      ;(first || panelRef.current)?.focus?.()
    })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      lastFocused.current?.focus?.()
    }
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn('absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-150', show ? 'opacity-100' : 'opacity-0')}
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-md rounded-2xl border border-outline-variant/40 bg-surface-container p-6 shadow-[0_12px_32px_-12px_rgba(0,100,102,0.25)] outline-none transition duration-150 ease-out',
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function DialogTitle({ children, className = '' }) {
  return <h2 className={cn('font-headline text-lg font-bold text-on-surface', className)}>{children}</h2>
}

export function DialogDescription({ children, className = '' }) {
  return <p className={cn('mt-2 text-sm leading-relaxed text-on-surface-variant', className)}>{children}</p>
}

export function DialogFooter({ children, className = '' }) {
  return <div className={cn('mt-6 flex justify-end gap-2', className)}>{children}</div>
}
