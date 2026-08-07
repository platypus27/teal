import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from './cn'

const positionClasses = {
  'bottom-right': 'teal-u-bottom-6 teal-u-right-6 teal-u-items-end',
  'bottom-left': 'teal-u-bottom-6 teal-u-left-6 teal-u-items-start',
  'top-right': 'teal-u-top-6 teal-u-right-6 teal-u-items-end',
  'top-left': 'teal-u-top-6 teal-u-left-6 teal-u-items-start',
}

const directionClasses = {
  up: 'teal-u-flex-col',
  down: 'teal-u-flex-col-reverse',
  left: 'teal-u-flex-row teal-u-items-center',
  right: 'teal-u-flex-row-reverse teal-u-items-center',
}

const nextKeys = ['ArrowDown', 'ArrowRight']
const prevKeys = ['ArrowUp', 'ArrowLeft']

// Lets an action close the fan and return focus to the trigger after activation.
const SpeedDialContext = createContext<() => void>(() => {})

export interface SpeedDialProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Direction the actions fan out toward. */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Icon shown on the closed trigger. Defaults to a plus icon. */
  icon?: ReactNode
  /** Accessible name for the trigger button. */
  label: string
  /** Called when the dial opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state. */
  open?: boolean
  /** Icon shown on the open trigger. Defaults to an X icon. */
  openIcon?: ReactNode
  /** Viewport corner the dial is fixed to. */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export const SpeedDial = forwardRef<HTMLDivElement, SpeedDialProps>(function SpeedDial(
  {
    children,
    className,
    defaultOpen = false,
    direction = 'up',
    icon,
    label,
    onOpenChange,
    open,
    openIcon,
    position = 'bottom-right',
    ...props
  },
  ref,
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open !== undefined ? open : internalOpen
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  function setOpen(next: boolean) {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function closeAndFocusTrigger() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  // Move focus into the fan when it opens.
  useEffect(() => {
    if (isOpen) menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [isOpen])

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])
    if (buttons.length === 0) return
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)

    if (event.key === 'Escape') {
      event.preventDefault()
      closeAndFocusTrigger()
      return
    }
    if (event.key === 'Tab') {
      setOpen(false)
      return
    }
    if (nextKeys.includes(event.key)) {
      event.preventDefault()
      buttons[(index + 1) % buttons.length]?.focus()
      return
    }
    if (prevKeys.includes(event.key)) {
      event.preventDefault()
      buttons[(index - 1 + buttons.length) % buttons.length]?.focus()
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      buttons[0]?.focus()
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      buttons[buttons.length - 1]?.focus()
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'teal-u-fixed teal-u-z-[var(--teal-z-fab,var(--teal-z-overlay))] teal-u-flex teal-u-gap-3',
        positionClasses[position],
        directionClasses[direction],
        className,
      )}
      {...props}
    >
      {isOpen ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          aria-orientation={direction === 'up' || direction === 'down' ? 'vertical' : 'horizontal'}
          onKeyDown={handleMenuKeyDown}
          className={cn(
            'teal-u-flex teal-u-gap-3',
            direction === 'up' || direction === 'down'
              ? 'teal-u-flex-col teal-u-items-end'
              : 'teal-u-flex-row teal-u-items-center',
          )}
        >
          <SpeedDialContext.Provider value={closeAndFocusTrigger}>{children}</SpeedDialContext.Provider>
        </div>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && isOpen) setOpen(false)
        }}
        className="teal-focus-ring teal-u-inline-flex teal-u-size-14 teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-bg-primary teal-u-text-on-primary teal-u-shadow-overlay hover:teal-u-bg-primary/90 active:teal-u-scale-95 motion-reduce:teal-u-transform-none"
      >
        {isOpen
          ? (openIcon ?? <X aria-hidden="true" className="teal-u-size-[var(--teal-icon-lg)]" />)
          : (icon ?? <Plus aria-hidden="true" className="teal-u-size-[var(--teal-icon-lg)]" />)}
      </button>
    </div>
  )
})

export interface SpeedDialActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Icon rendered inside the action button. */
  icon?: ReactNode
  /** Accessible name; also shown as the visible label chip next to the icon. */
  label: string
}

export const SpeedDialAction = forwardRef<HTMLButtonElement, SpeedDialActionProps>(function SpeedDialAction(
  { className, icon, label, onClick, type = 'button', ...props },
  ref,
) {
  const closeAndFocusTrigger = useContext(SpeedDialContext)

  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      tabIndex={-1}
      aria-label={label}
      onClick={(event) => {
        onClick?.(event)
        closeAndFocusTrigger()
      }}
      className={cn('teal-focus-ring teal-u-group teal-u-inline-flex teal-u-items-center teal-u-gap-2 teal-u-rounded-full', className)}
      {...props}
    >
      <span className="teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-px-2.5 teal-u-py-1 teal-u-text-xs teal-u-font-semibold teal-u-text-on-surface teal-u-shadow-sm">
        {label}
      </span>
      <span className="teal-u-inline-flex teal-u-size-10 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-bg-surface-container-high teal-u-text-on-surface teal-u-shadow-sm group-hover:teal-u-bg-surface-container-highest">
        {icon ?? <Plus aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />}
      </span>
    </button>
  )
})
