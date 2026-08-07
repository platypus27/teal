import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FloatingToolbar } from '../src/FloatingToolbar'

function renderToolbar(props = {}) {
  return render(
    <FloatingToolbar {...props}>
      <button type="button">Bold</button>
      <button type="button">Italic</button>
      <button type="button">Link</button>
    </FloatingToolbar>,
  )
}

describe('FloatingToolbar', () => {
  it('renders a toolbar with an accessible name', () => {
    renderToolbar()

    expect(screen.getByRole('toolbar', { name: 'Contextual actions' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
  })

  it('renders nothing when open is false', () => {
    renderToolbar({ open: false })

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
  })

  it('keeps a single tab stop with roving tabindex', () => {
    renderToolbar()

    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('button', { name: 'Link' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves focus and the tab stop with arrow keys', () => {
    renderToolbar()

    const bold = screen.getByRole('button', { name: 'Bold' })
    bold.focus()
    fireEvent.keyDown(bold, { key: 'ArrowRight' })

    const italic = screen.getByRole('button', { name: 'Italic' })
    expect(italic).toHaveFocus()
    expect(italic).toHaveAttribute('tabindex', '0')
    expect(bold).toHaveAttribute('tabindex', '-1')

    fireEvent.keyDown(italic, { key: 'ArrowRight' })
    expect(screen.getByRole('button', { name: 'Link' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('button', { name: 'Link' }), { key: 'ArrowRight' })
    expect(bold).toHaveFocus()

    fireEvent.keyDown(bold, { key: 'ArrowLeft' })
    expect(screen.getByRole('button', { name: 'Link' })).toHaveFocus()
  })

  it('supports Home and End', () => {
    renderToolbar()

    const bold = screen.getByRole('button', { name: 'Bold' })
    bold.focus()
    fireEvent.keyDown(bold, { key: 'End' })
    expect(screen.getByRole('button', { name: 'Link' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('button', { name: 'Link' }), { key: 'Home' })
    expect(bold).toHaveFocus()
  })

  it('skips disabled controls when moving focus', () => {
    render(
      <FloatingToolbar>
        <button type="button">Bold</button>
        <button type="button" disabled>
          Italic
        </button>
        <button type="button">Link</button>
      </FloatingToolbar>,
    )

    const bold = screen.getByRole('button', { name: 'Bold' })
    bold.focus()
    fireEvent.keyDown(bold, { key: 'ArrowRight' })
    expect(screen.getByRole('button', { name: 'Link' })).toHaveFocus()
  })

  it('still activates controls on click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <FloatingToolbar>
        <button type="button" onClick={onClick}>
          Bold
        </button>
      </FloatingToolbar>,
    )

    await user.click(screen.getByRole('button', { name: 'Bold' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
