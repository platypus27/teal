import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { User } from 'lucide-react'
import { cn } from './cn'

const avatarVariants = cva(
  'box-border inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-solid border-[color:var(--teal-border-subtle)] bg-surface-container-high text-on-surface-variant shadow-sm',
  {
    variants: {
      size: {
        sm: 'size-8 text-xs [&_svg]:size-[var(--teal-icon-sm)]',
        md: 'size-10 text-sm [&_svg]:size-[var(--teal-icon-md)]',
        lg: 'size-12 text-base [&_svg]:size-[var(--teal-icon-lg)]',
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
  const [failed, setFailed] = useState(false)
  const showImage = src !== undefined && src !== '' && !failed
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
        <img src={src} alt={label ?? ''} className="size-full object-cover" onError={() => setFailed(true)} />
      ) : initials ? (
        <span aria-hidden="true" className="font-semibold">
          {initials}
        </span>
      ) : (
        <User aria-hidden="true" />
      )}
    </span>
  )
})

export { avatarVariants }
