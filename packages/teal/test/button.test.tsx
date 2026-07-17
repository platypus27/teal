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
})
