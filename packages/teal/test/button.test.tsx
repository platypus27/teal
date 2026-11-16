import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, IconButton } from '../src/index'

describe('Button', () => {
  it('does not submit a form unless the caller explicitly requests it', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())

    render(
      <form onSubmit={onSubmit}>
        <Button>Save draft</Button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Save draft' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('exposes loading state without losing its accessible name', () => {
    render(<Button loading>Save changes</Button>)

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Save changes' })).toHaveAttribute('aria-busy', 'true')
  })

  it('composes onto one child when rendered asChild', () => {
    render(
      <Button asChild>
        <a href="/settings">Open settings</a>
      </Button>,
    )
    expect(screen.getByRole('link', { name: 'Open settings' })).toHaveAttribute('href', '/settings')
  })

  it('rejects disabled semantics on polymorphic children', () => {
    expect(() => render(
      <Button {...({ asChild: true, disabled: true } as React.ComponentProps<typeof Button>)}>
        <a href="/settings">Open settings</a>
      </Button>,
    )).toThrow('Button cannot combine asChild with disabled or loading')
  })
})

describe('Button disabled treatment', () => {
  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'gives the %s variant an explicit disabled state in every theme',
    (variant) => {
      render(<Button variant={variant} disabled>Save</Button>)
      const button = screen.getByRole('button', { name: 'Save' })

      expect(button).toBeDisabled()
      expect(button).toHaveClass(
        'disabled:teal-u-bg-on-surface/[0.12]',
        'disabled:teal-u-text-on-surface/[0.38]',
        'disabled:teal-u-border-transparent',
        'disabled:teal-u-cursor-not-allowed',
      )
      expect(button).not.toHaveClass('disabled:teal-u-opacity-55', 'disabled:teal-u-pointer-events-none')
    },
  )

  it('keeps hover and press feedback off disabled buttons', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })

    expect(button).toHaveClass('hover:enabled:teal-u-bg-primary/90', 'active:enabled:teal-u-scale-[0.98]')
  })
})

describe('IconButton', () => {
  it('uses its required label as the accessible name', () => {
    render(<IconButton label="Search">icon</IconButton>)
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('type', 'button')
  })

  it('swaps the icon for a spinner and disables the button while loading', () => {
    render(<IconButton label="Refreshing" loading>icon</IconButton>)
    const button = screen.getByRole('button', { name: 'Refreshing' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).not.toHaveTextContent('icon')
  })

  it('shows an explicit disabled pill instead of opacity alone', () => {
    render(<IconButton label="Share" disabled>icon</IconButton>)
    const button = screen.getByRole('button', { name: 'Share' })

    expect(button).toHaveClass(
      'disabled:teal-u-bg-on-surface/[0.12]',
      'disabled:teal-u-text-on-surface/[0.38]',
      'disabled:teal-u-cursor-not-allowed',
    )
    expect(button).not.toHaveClass('disabled:teal-u-opacity-55', 'disabled:teal-u-pointer-events-none')
  })
})
