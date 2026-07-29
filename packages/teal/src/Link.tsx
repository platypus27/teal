import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowUpRight } from 'lucide-react'
import { cn } from './cn'

const linkVariants = cva('teal-focus-ring teal-u-rounded teal-u-text-primary teal-u-font-semibold', {
  variants: {
    variant: {
      inline:
        'teal-u-underline teal-u-underline-offset-2 teal-u-decoration-primary/40 hover:teal-u-decoration-primary',
      standalone: 'teal-u-no-underline teal-u-underline-offset-4 hover:teal-u-underline',
    },
  },
  defaultVariants: {
    variant: 'inline',
  },
})

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /** Composes the link styles onto a single child element instead of rendering an anchor. */
  asChild?: boolean
  /** Opens the link in a new tab with `rel="noreferrer"` and appends an external-link indicator. */
  external?: boolean
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { asChild = false, children, className, external = false, variant, ...props },
  ref,
) {
  const classes = cn(linkVariants({ variant }), className)

  if (asChild) {
    return (
      <Slot ref={ref} className={classes} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...props}>
        {children}
      </Slot>
    )
  }

  return (
    <a ref={ref} className={classes} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...props}>
      {children}
      {external ? (
        <ArrowUpRight aria-hidden="true" className="teal-u-ml-0.5 teal-u-inline-block teal-u-size-[0.875em] teal-u-align-[-0.1em]" />
      ) : null}
    </a>
  )
})
