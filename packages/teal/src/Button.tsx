import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import { cn } from './cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 motion-reduce:transform-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary/90',
        secondary:
          'border border-outline-variant/50 bg-surface-container text-on-surface hover:bg-surface-container-high',
        ghost: 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
        danger: 'bg-error text-on-error hover:bg-error-dim',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: false
  loading?: boolean
}

type ChildButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'type'> & {
  asChild: true
  disabled?: never
  loading?: never
  type?: never
}

export type ButtonProps = ButtonVariantProps & (NativeButtonProps | ChildButtonProps)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, children, className, disabled, loading = false, size, type, variant, ...props },
  ref,
) {
  if (asChild && (disabled || loading)) {
    throw new Error('Button cannot combine asChild with disabled or loading')
  }

  const classes = cn(buttonVariants({ variant, size }), className)

  if (asChild) {
    return (
      <Slot ref={ref} className={classes} {...props}>
        {children}
      </Slot>
    )
  }

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={classes}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : null}
      {children}
    </button>
  )
})

const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-55 motion-reduce:transform-none',
  {
    variants: {
      variant: {
        ghost: 'hover:bg-surface-container-high hover:text-on-surface',
        secondary: 'border border-outline-variant/50 bg-surface-container hover:bg-surface-container-high',
        danger: 'text-error hover:bg-error/10',
      },
      size: {
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-10 [&_svg]:size-5',
        lg: 'size-12 [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
)

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
    VariantProps<typeof iconButtonVariants> {
  /** Accessible label applied as `aria-label`; also used as the default tooltip text. */
  label: string
  /** Replaces the icon with a spinner and disables the button while true. */
  loading?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, disabled, label, loading = false, size, title, type = 'button', variant, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      title={title ?? label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
      ) : (
        children
      )}
    </button>
  )
})

export { buttonVariants, iconButtonVariants }
