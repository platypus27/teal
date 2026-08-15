import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from './cn'
import { Tooltip } from './Tooltip'

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

const tooltipSides = {
  'bottom-right': 'left',
  'bottom-left': 'right',
  'top-right': 'left',
  'top-left': 'right',
} as const

export interface FloatingActionButtonAction {
  /** Icon rendered inside the action button. */
  icon?: ReactNode
  /** Accessible name; also shown as the visible label chip next to the icon. */
  label: string
  /** Called when the action is chosen; the dial then closes and refocuses the FAB. */
  onClick?: () => void
}

export interface FloatingActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Related actions the button fans out into; turns the FAB into a menu trigger. */
  actions?: FloatingActionButtonAction[]
  /** Initial open state of the fan-out when uncontrolled. */
  defaultOpen?: boolean
  /** Direction the actions fan out toward. */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Text rendered next to the icon; turns the round FAB into an extended pill. */
  extendedLabel?: string
  /** Icon rendered inside the button. Defaults to a plus icon. */
  icon?: ReactNode
  /** Accessible name for the button; also the default tooltip text. */
  label: string
  /** Called when the actions fan-out opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state of the fan-out. */
  open?: boolean
  /** Icon shown on the open trigger when actions are present. Defaults to an X icon. */
  openIcon?: ReactNode
  /** Viewport corner the button is fixed to. */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Tooltip text shown on hover and focus; pass the label or a longer hint. */
  tooltip?: string
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  function FloatingActionButton(
    {
      actions,
      className,
      defaultOpen = false,
      direction = 'up',
      extendedLabel,
      icon,
      label,
      onOpenChange,
      open,
      openIcon,
      position = 'bottom-right',
      tooltip,
      type = 'button',
      ...props
    },
    ref,
  ) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const isOpen = open !== undefined ? open : internalOpen
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)

    function setTriggerRefs(node: HTMLButtonElement | null) {
      triggerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    function setOpen(next: boolean) {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    }

    function closeAndFocusTrigger() {
      setOpen(false)
      triggerRef.current?.focus()
    }

    // Move focus into the fan-out when it opens.
    useEffect(() => {
      if (isOpen && actions) menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    }, [isOpen, actions])

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

    const tooltipText = tooltip ?? (extendedLabel && !actions ? undefined : label)

    if (actions) {
      const trigger = (
        <button
          ref={setTriggerRefs}
          type={type}
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
      )

      return (
        <div
          className={cn(
            'teal-u-fixed teal-u-z-[var(--teal-z-fab,var(--teal-z-overlay))] teal-u-flex teal-u-gap-3',
            positionClasses[position],
            directionClasses[direction],
            className,
          )}
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
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-label={action.label}
                  onClick={() => {
                    action.onClick?.()
                    closeAndFocusTrigger()
                  }}
                  className="teal-focus-ring teal-u-group teal-u-inline-flex teal-u-items-center teal-u-gap-2 teal-u-rounded-full"
                >
                  <span className="teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-px-2.5 teal-u-py-1 teal-u-text-xs teal-u-font-semibold teal-u-text-on-surface teal-u-shadow-sm">
                    {action.label}
                  </span>
                  <span className="teal-u-inline-flex teal-u-size-10 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-bg-surface-container-high teal-u-text-on-surface teal-u-shadow-sm group-hover:teal-u-bg-surface-container-highest">
                    {action.icon ?? <Plus aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          {tooltipText ? <Tooltip content={tooltipText} side={tooltipSides[position]}>{trigger}</Tooltip> : trigger}
        </div>
      )
    }

    const button = (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cn(
          'teal-focus-ring teal-u-fixed teal-u-z-[var(--teal-z-fab,var(--teal-z-overlay))] teal-u-inline-flex teal-u-items-center teal-u-justify-center teal-u-gap-2 teal-u-bg-primary teal-u-text-on-primary teal-u-shadow-overlay teal-u-transition-shadow hover:teal-u-bg-primary/90 active:teal-u-scale-95 motion-reduce:teal-u-transform-none motion-reduce:teal-u-transition-none',
          extendedLabel ? 'teal-u-h-14 teal-u-rounded-2xl teal-u-px-5 teal-u-text-sm teal-u-font-bold' : 'teal-u-size-14 teal-u-rounded-full',
          positionClasses[position],
          className,
        )}
        {...props}
      >
        {icon ?? <Plus aria-hidden="true" className="teal-u-size-[var(--teal-icon-lg)]" />}
        {extendedLabel ? <span>{extendedLabel}</span> : null}
      </button>
    )

    if (!tooltipText) return button
    return (
      <Tooltip content={tooltipText} side={tooltipSides[position]}>
        {button}
      </Tooltip>
    )
  },
)
