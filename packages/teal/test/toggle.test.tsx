import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from '../src/Toggle'

describe('Toggle', () => {
  it('toggles aria-pressed and data-state on click', async () => {
    const user = userEvent.setup()
    render(<Toggle aria-label="Bold">B</Toggle>)

    const toggle = screen.getByRole('button', { name: 'Bold' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle).toHaveAttribute('data-state', 'off')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(toggle).toHaveAttribute('data-state', 'on')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle).toHaveAttribute('data-state', 'off')
  })

  it('honors defaultPressed and reports changes', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(
      <Toggle aria-label="Italic" defaultPressed onPressedChange={onPressedChange}>
        I
      </Toggle>,
    )

    const toggle = screen.getByRole('button', { name: 'Italic' })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await user.click(toggle)
    expect(onPressedChange).toHaveBeenCalledWith(false)
  })

  it('supports a controlled pressed state', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(
      <Toggle aria-label="Underline" pressed onPressedChange={onPressedChange}>
        U
      </Toggle>,
    )

    const toggle = screen.getByRole('button', { name: 'Underline' })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await user.click(toggle)
    expect(onPressedChange).toHaveBeenCalledWith(false)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(
      <Toggle aria-label="Locked" disabled onPressedChange={onPressedChange}>
        L
      </Toggle>,
    )

    const toggle = screen.getByRole('button', { name: 'Locked' })
    expect(toggle).toBeDisabled()

    await user.click(toggle)
    expect(onPressedChange).not.toHaveBeenCalled()
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })

  it('applies sm sizing classes', () => {
    render(
      <Toggle aria-label="Small" size="sm">
        S
      </Toggle>,
    )
    const toggle = screen.getByRole('button', { name: 'Small' })
    expect(toggle.className).toContain('teal-u-h-8')
    expect(toggle.className).toContain('teal-u-text-xs')
  })
})
