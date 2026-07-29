import { forwardRef, type HTMLAttributes } from 'react'
import { Avatar } from './Avatar'
import { cn } from './cn'

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Names to render as avatars, in order. */
  names: string[]
  /** Maximum number of avatars shown before collapsing the rest into a count bubble. */
  max?: number
  /** Avatar size. */
  size?: 'sm' | 'md'
}

/**
 * An overlapping stack of avatars with a `+N` overflow bubble. The group
 * exposes the full name list as its accessible label.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { className, max = 4, names, size = 'md', ...props },
  ref,
) {
  const visible = names.slice(0, max)
  const overflow = names.length - visible.length

  return (
    <div
      ref={ref}
      role="group"
      aria-label={names.join(', ')}
      className={cn('teal-u-flex teal-u-items-center -teal-u-space-x-2', className)}
      {...props}
    >
      {visible.map((name) => (
        <Avatar key={name} name={name} size={size} className="teal-u-ring-2 teal-u-ring-surface" />
      ))}
      {overflow > 0 ? (
        <span
          aria-hidden="true"
          className={cn(
            'teal-u-box-border teal-u-inline-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-bg-surface-container-highest teal-u-text-xs teal-u-font-bold teal-u-text-on-surface-variant teal-u-ring-2 teal-u-ring-surface',
            size === 'sm' ? 'teal-u-size-8' : 'teal-u-size-10',
          )}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  )
})
