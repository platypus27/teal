import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import { cn } from './cn'

const secondaryActionClasses =
  'teal-u-box-border teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-shadow-sm hover:teal-u-border-[color:var(--teal-border-strong)] hover:teal-u-bg-surface-container-low'

const buttonVariants = cva(
  'teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-justify-center teal-u-gap-2 teal-u-whitespace-nowrap teal-u-rounded-full teal-u-font-bold active:teal-u-scale-[0.98] disabled:teal-u-pointer-events-none disabled:teal-u-opacity-55 motion-reduce:teal-u-transform-none',
  {
    variants: {
      variant: {
        primary: 'teal-u-bg-primary teal-u-text-on-primary hover:teal-u-bg-primary/90',
        secondary: cn(secondaryActionClasses, 'teal-u-text-on-surface'),
        ghost: 'teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface',
        danger: 'teal-u-bg-error teal-u-text-on-error hover:teal-u-bg-error-dim',
      },
      size: {
        sm: 'teal-u-h-8 teal-u-px-3 teal-u-text-xs',
        md: 'teal-u-h-10 teal-u-px-5 teal-u-text-sm',
        lg: 'teal-u-h-12 teal-u-px-6 teal-u-text-base',
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
      {loading ? <LoaderCircle aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)] teal-u-animate-spin motion-reduce:teal-u-animate-none" /> : null}
      {children}
    </button>
  )
})

const iconButtonVariants = cva(
  'teal-focus-ring teal-u-inline-flex teal-u-shrink-0 teal-u-items-center teal-u-justify-center teal-u-rounded-full teal-u-text-on-surface-variant active:teal-u-scale-95 disabled:teal-u-pointer-events-none disabled:teal-u-opacity-55 motion-reduce:teal-u-transform-none',
  {
    variants: {
      variant: {
        ghost: 'hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface',
        secondary: secondaryActionClasses,
        danger: 'teal-u-text-error hover:teal-u-bg-error/10',
      },
      size: {
        sm: 'teal-u-size-8 [&_svg]:teal-u-size-[var(--teal-icon-sm)]',
        md: 'teal-u-size-10 [&_svg]:teal-u-size-[var(--teal-icon-md)]',
        lg: 'teal-u-size-12 [&_svg]:teal-u-size-[var(--teal-icon-lg)]',
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
        <LoaderCircle aria-hidden="true" className="teal-u-animate-spin motion-reduce:teal-u-animate-none" />
      ) : (
        children
      )}
    </button>
  )
})

export { buttonVariants, iconButtonVariants }
