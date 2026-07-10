import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from './cn.js'

let nextId = 1
let toasts = []
const listeners = new Set()

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return toasts
}

export function toast(message, { tone = 'neutral', duration = 4000 } = {}) {
  const id = nextId++
  toasts = [...toasts, { id, message, tone, duration }]
  emit()
  return id
}

export function dismissToast(id) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

const TONES = {
  success: { icon: 'check_circle', text: 'text-tertiary' },
  error: { icon: 'error', text: 'text-error' },
  warning: { icon: 'warning', text: 'text-warning' },
  info: { icon: 'info', text: 'text-primary' },
  neutral: { icon: 'notifications', text: 'text-on-surface-variant' },
}

function ToastItem({ t }) {
  const tone = TONES[t.tone] || TONES.neutral
  const [hover, setHover] = useState(false)
  const remaining = useRef(t.duration)
  const started = useRef(0)
  const timer = useRef(null)

  useEffect(() => {
    if (hover) {
      clearTimeout(timer.current)
      remaining.current -= Date.now() - started.current
      return
    }
    started.current = Date.now()
    timer.current = setTimeout(() => dismissToast(t.id), Math.max(remaining.current, 0))
    return () => clearTimeout(timer.current)
  }, [hover, t.id])

  return (
    <div
      role="status"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => dismissToast(t.id)}
      className="relative flex w-72 cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container py-3 pl-4 pr-3 shadow-[0_12px_32px_-12px_rgba(0,100,102,0.25)]"
    >
      <span className={cn('material-symbols-outlined text-[20px]', tone.text)} style={{ fontVariationSettings: "'FILL' 1" }}>
        {tone.icon}
      </span>
      <span className="flex-1 text-sm text-on-surface">{t.message}</span>
    </div>
  )
}

export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot)

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 sm:inset-x-auto sm:right-0">
      <div className="flex flex-col items-end gap-2">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem t={t} />
          </div>
        ))}
      </div>
    </div>,
    document.body,
  )
}
