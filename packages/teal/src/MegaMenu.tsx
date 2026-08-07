import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from './cn'

interface MegaMenuContextValue {
  openId: string | null
  setOpenId: (id: string | null) => void
}

const MegaMenuContext = createContext<MegaMenuContextValue>({
  openId: null,
  setOpenId: () => {},
})

export interface MegaMenuProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the navigation landmark. */
  'aria-label'?: string
}

export const MegaMenu = forwardRef<HTMLElement, MegaMenuProps>(function MegaMenu(
  { 'aria-label': ariaLabel = 'Main', className, children, onKeyDown, ...props },
  ref,
) {
  const [openId, setOpenId] = useState<string | null>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    // Arrow keys move between top-level triggers; while a panel is open the
    // newly focused trigger opens its own panel.
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const target = event.target as HTMLElement
      const itemId = target.getAttribute('data-teal-mega-menu-trigger')
      if (itemId !== null) {
        const triggers = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>('[data-teal-mega-menu-trigger]'),
        )
        const index = triggers.indexOf(target)
        if (index !== -1) {
          event.preventDefault()
          const delta = event.key === 'ArrowRight' ? 1 : -1
          const next = triggers[(index + delta + triggers.length) % triggers.length]
          next?.focus()
          if (openId !== null) setOpenId(next?.getAttribute('data-teal-mega-menu-trigger') ?? null)
        }
      }
    }
    onKeyDown?.(event)
  }

  return (
    <MegaMenuContext.Provider value={{ openId, setOpenId }}>
      <nav ref={ref} aria-label={ariaLabel} className={className} onKeyDown={handleKeyDown} {...props}>
        <ul className="teal-u-flex teal-u-items-center teal-u-gap-1">{children}</ul>
      </nav>
    </MegaMenuContext.Provider>
  )
})

export interface MegaMenuItemProps extends HTMLAttributes<HTMLLIElement> {
  /** Text of the top-level trigger button. */
  label: string
}

export const MegaMenuItem = forwardRef<HTMLLIElement, MegaMenuItemProps>(function MegaMenuItem(
  { className, label, children, ...props },
  ref,
) {
  const { openId, setOpenId } = useContext(MegaMenuContext)
  const id = useId()
  const panelId = `${id}-panel`
  const open = openId === id
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const focusFirstLinkOnOpen = useRef(false)
  const suppressFocusOpen = useRef(false)

  useEffect(() => {
    if (open && focusFirstLinkOnOpen.current) {
      focusFirstLinkOnOpen.current = false
      panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
    }
  }, [open])

  function close(restoreFocus: boolean) {
    suppressFocusOpen.current = restoreFocus
    setOpenId(null)
    if (restoreFocus) triggerRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      close(true)
      return
    }
    const target = event.target as HTMLElement
    const panel = panelRef.current
    if (!panel || !panel.contains(target)) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      // Flat next/previous across every link, so focus crosses column edges.
      const links = Array.from(panel.querySelectorAll<HTMLElement>('a[href]'))
      const index = links.indexOf(target)
      if (index === -1) return
      event.preventDefault()
      const delta = event.key === 'ArrowRight' ? 1 : -1
      links[(index + delta + links.length) % links.length]?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      triggerRef.current?.focus()
    }
  }

  return (
    <li
      ref={ref}
      className={cn('teal-u-relative', className)}
      onMouseEnter={() => setOpenId(id)}
      onMouseLeave={() => {
        if (open) setOpenId(null)
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <button
        ref={triggerRef}
        type="button"
        data-teal-mega-menu-trigger={id}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpenId(open ? null : id)}
        onFocus={() => {
          if (!suppressFocusOpen.current) setOpenId(id)
          suppressFocusOpen.current = false
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            focusFirstLinkOnOpen.current = true
            if (open) panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
            else setOpenId(id)
          }
        }}
        className={cn(
          'teal-focus-ring teal-u-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-font-medium teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
          open
            ? 'teal-u-bg-surface-container-high teal-u-text-primary'
            : 'teal-u-text-on-surface hover:teal-u-bg-surface-container-high',
        )}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'teal-u-size-4 teal-u-transition-transform teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none',
            open && 'teal-u-rotate-180',
          )}
        />
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          className="teal-u-absolute teal-u-left-0 teal-u-top-full teal-u-z-[var(--teal-z-overlay,var(--teal-z-tooltip))] teal-u-mt-1 teal-u-flex teal-u-gap-8 teal-u-rounded-2xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-lowest teal-u-p-6 teal-u-shadow-overlay"
        >
          {children}
        </div>
      ) : null}
    </li>
  )
})

export interface MegaMenuColumnProps extends HTMLAttributes<HTMLDivElement> {
  /** Heading shown above the column's links. */
  heading?: string
}

export const MegaMenuColumn = forwardRef<HTMLDivElement, MegaMenuColumnProps>(function MegaMenuColumn(
  { className, heading, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('teal-u-flex teal-u-min-w-40 teal-u-flex-col teal-u-gap-0.5', className)} {...props}>
      {heading ? (
        <div className="teal-u-px-3 teal-u-pb-1 teal-u-text-xs teal-u-font-bold teal-u-uppercase teal-u-tracking-wider teal-u-text-on-surface-variant">
          {heading}
        </div>
      ) : null}
      {children}
    </div>
  )
})

export const MegaMenuLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  function MegaMenuLink({ className, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={cn(
          'teal-focus-ring teal-u-rounded-lg teal-u-px-3 teal-u-py-2 teal-u-text-sm teal-u-text-on-surface hover:teal-u-bg-surface-container-high hover:teal-u-text-primary',
          className,
        )}
        {...props}
      />
    )
  },
)
