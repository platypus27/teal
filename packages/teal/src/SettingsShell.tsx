import { forwardRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from './cn'

export interface SettingsShellItem {
  /** Stable item identifier. */
  id: string
  /** Visible label. */
  label: ReactNode
  /** Marks the item as the current section; sets aria-current="page" and draws the accent edge. */
  current?: boolean
  /** When set, the item renders as an anchor to another settings page. */
  href?: string
  /** When set (and no href is given), the item renders as a button and calls this on activation. */
  onSelect?: () => void
}

export interface SettingsShellGroup {
  /** Optional uppercase heading rendered above the group's items. */
  label?: string
  /** Items belonging to the group. */
  items: SettingsShellItem[]
}

export interface SettingsShellProps {
  /** Product accent token name used for the active item's edge, for example '--teal-color-product-trict'. Defaults to '--teal-color-product-home'. */
  accent?: string
  /** Panel content: the form or settings controls for the current section. */
  children: ReactNode
  className?: string
  /** Supporting text rendered under the title. */
  description?: ReactNode
  /** Notice area rendered above the content; compose StepUpNotice here when a sensitive section needs fresh verification. */
  notice?: ReactNode
  /** Save/discard/dirty-hint row rendered below the content behind a dashed divider. */
  saveBar?: ReactNode
  /** Section groups for the left navigation. */
  sections: SettingsShellGroup[]
  /** Panel heading naming the current section. */
  title: ReactNode
}

const itemClasses =
  'teal-focus-ring teal-u-flex teal-u-w-full teal-u-items-center teal-u-rounded-[var(--teal-radius-control)] teal-u-px-2.5 teal-u-py-2 teal-u-text-start teal-u-text-sm teal-u-font-semibold teal-u-transition-colors teal-u-duration-[var(--teal-motion-fast)] motion-reduce:teal-u-transition-none'

/**
 * The unified settings layout shared by every Kryv product: a sections nav on
 * the left (group labels, accent edge on the current item in the product's
 * own accent color) and a content panel on the right, with slots for a
 * step-up notice and a save bar. Items render as anchors when they carry an
 * href and as buttons otherwise; both are keyboard navigable and the current
 * item sets aria-current="page".
 */
export const SettingsShell = forwardRef<HTMLDivElement, SettingsShellProps>(function SettingsShell(
  { accent = '--teal-color-product-home', children, className, description, notice, saveBar, sections, title },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{ '--teal-settings-accent': `var(${accent})` } as CSSProperties}
      className={cn(
        'teal-u-grid teal-u-overflow-hidden teal-u-rounded-[var(--teal-radius-surface)] teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-text-on-surface teal-u-shadow-voxel md:teal-u-grid-cols-[15rem_minmax(0,1fr)]',
        className,
      )}
    >
      <nav
        aria-label="Settings sections"
        className="teal-u-border-b teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container teal-u-px-3 teal-u-py-4 md:teal-u-border-b-0 md:teal-u-border-e"
      >
        {sections.map((section, index) => (
          <div key={section.label ?? index} className="teal-u-space-y-0.5 teal-u-pb-2">
            {section.label ? (
              <div className="teal-u-px-2.5 teal-u-pb-1 teal-u-pt-3 teal-u-text-xs teal-u-font-bold teal-u-uppercase teal-u-tracking-wider teal-u-text-on-surface-variant">
                {section.label}
              </div>
            ) : null}
            {section.items.map((item) => {
              const classes = cn(
                itemClasses,
                item.current
                  ? 'teal-u-bg-surface teal-u-text-on-surface teal-u-shadow-[inset_3px_0_0_var(--teal-settings-accent)]'
                  : 'teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface',
              )
              return item.href !== undefined ? (
                <a key={item.id} href={item.href} aria-current={item.current ? 'page' : undefined} className={classes}>
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  aria-current={item.current ? 'page' : undefined}
                  onClick={item.onSelect}
                  className={classes}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="teal-u-min-w-0 teal-u-p-6 md:teal-u-p-8">
        <h2 className="teal-u-font-headline teal-u-text-xl teal-u-font-bold">{title}</h2>
        {description ? (
          <p className="teal-u-mb-5 teal-u-mt-1 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface-variant">
            {description}
          </p>
        ) : null}
        {notice ? <div className="teal-u-mb-5 teal-u-max-w-xl">{notice}</div> : null}
        {children}
        {saveBar ? (
          <div className="teal-u-mt-6 teal-u-flex teal-u-max-w-xl teal-u-items-center teal-u-gap-3 teal-u-border-t teal-u-border-dashed teal-u-border-[color:var(--teal-border-subtle)] teal-u-pt-4">
            {saveBar}
          </div>
        ) : null}
      </div>
    </div>
  )
})
