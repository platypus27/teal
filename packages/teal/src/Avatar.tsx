import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { User } from 'lucide-react'
import { cn } from './cn'

const avatarVariants = cva(
  'teal-u-box-border teal-u-inline-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-overflow-hidden teal-u-rounded-full teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-high teal-u-text-on-surface-variant teal-u-shadow-sm',
  {
    variants: {
      size: {
        sm: 'teal-u-size-8 teal-u-text-xs [&_svg]:teal-u-size-[var(--teal-icon-sm)]',
        md: 'teal-u-size-10 teal-u-text-sm [&_svg]:teal-u-size-[var(--teal-icon-md)]',
        lg: 'teal-u-size-12 teal-u-text-base [&_svg]:teal-u-size-[var(--teal-icon-lg)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

function initialsFor(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof avatarVariants> {
  /** Image alt text; defaults to `name`. Pass an empty string for decorative avatars. */
  alt?: string
  /** Name used for the initials fallback and default alt text. */
  name?: string
  /** Image URL; falls back to initials when missing or when the image fails to load. */
  src?: string
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { alt, className, name, size, src, ...props },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = src !== undefined && src !== '' && src !== failedSrc
  const initials = name ? initialsFor(name) : ''
  const label = alt ?? name
  return (
    <span
      ref={ref}
      {...(!showImage && label ? { role: 'img', 'aria-label': label } : {})}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={label ?? ''}
          className="teal-u-size-full teal-u-object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : initials ? (
        <span aria-hidden="true" className="teal-u-font-semibold">
          {initials}
        </span>
      ) : (
        <User aria-hidden="true" />
      )}
    </span>
  )
})

export { avatarVariants }
