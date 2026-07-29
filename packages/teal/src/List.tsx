import { createContext, forwardRef, useContext, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

const ListDensityContext = createContext(false)

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Reduces the vertical padding of every item. */
  dense?: boolean
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List({ className, dense = false, ...props }, ref) {
  return (
    <ListDensityContext.Provider value={dense}>
      <ul ref={ref} className={cn('teal-u-list-none teal-u-p-0', className)} {...props} />
    </ListDensityContext.Provider>
  )
})

export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  /** Content rendered before the text, e.g. an icon or avatar. */
  leading?: ReactNode
  /** Called when the item is activated; makes the item a button. */
  onClick?: () => void
  /** Supporting text rendered under the title. */
  secondary?: ReactNode
  /** Primary text of the item. */
  title: ReactNode
  /** Content rendered after the text, e.g. metadata or an action. */
  trailing?: ReactNode
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { className, leading, onClick, secondary, title, trailing, ...props },
  ref,
) {
  const dense = useContext(ListDensityContext)

  const body = (
    <>
      {leading ? <span className="teal-u-flex teal-u-shrink-0 teal-u-items-center [&_svg]:teal-u-size-[var(--teal-icon-md)]">{leading}</span> : null}
      <span className="teal-u-grid teal-u-min-w-0 teal-u-flex-1 teal-u-gap-0.5">
        <span className="teal-u-truncate teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">{title}</span>
        {secondary ? <span className="teal-u-truncate teal-u-text-xs teal-u-text-on-surface-variant">{secondary}</span> : null}
      </span>
      {trailing ? <span className="teal-u-flex teal-u-shrink-0 teal-u-items-center teal-u-text-sm teal-u-text-on-surface-variant">{trailing}</span> : null}
    </>
  )

  const layoutClasses = cn('teal-u-flex teal-u-w-full teal-u-items-center teal-u-gap-3 teal-u-text-left', dense ? 'teal-u-px-3 teal-u-py-1.5' : 'teal-u-px-3 teal-u-py-3')

  return (
    <li
      ref={ref}
      className={cn('teal-u-border-0 teal-u-border-b teal-u-border-solid teal-u-border-outline-variant/40 last:teal-u-border-b-0', className)}
      {...props}
    >
      {onClick ? (
        <button type="button" onClick={onClick} className={cn('teal-focus-ring teal-u-cursor-pointer hover:teal-u-bg-surface-container-high', layoutClasses)}>
          {body}
        </button>
      ) : (
        <div className={layoutClasses}>{body}</div>
      )}
    </li>
  )
})
