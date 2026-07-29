import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColorPicker } from '../src/ColorPicker'

describe('ColorPicker', () => {
  it('shows the current color value on the trigger', () => {
    render(<ColorPicker />)

    const trigger = screen.getByRole('button', { name: 'Choose color' })
    expect(trigger).toHaveTextContent('#006a6c')
  })

  it('opens the popover with the selected swatch marked', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)

    await user.click(screen.getByRole('button', { name: 'Choose color' }))

    expect(await screen.findByRole('button', { name: 'Teal' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Red' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('textbox', { name: 'Hex color' })).toHaveValue('#006a6c')
  })

  it('selects a preset swatch, reports it, and closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorPicker onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Choose color' }))
    await user.click(await screen.findByRole('button', { name: 'Red' }))

    expect(onChange).toHaveBeenCalledWith('#c81e41')
    expect(screen.queryByRole('button', { name: 'Red' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choose color' })).toHaveTextContent('#c81e41')
  })

  it('accepts a shorthand hex value and normalizes it', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorPicker onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Choose color' }))
    const hex = await screen.findByRole('textbox', { name: 'Hex color' })
    await user.clear(hex)
    await user.type(hex, '#fff{Enter}')

    expect(onChange).toHaveBeenLastCalledWith('#ffffff')
    expect(hex).not.toHaveAttribute('aria-invalid')
  })

  it('flags an invalid hex value without reporting it', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorPicker onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Choose color' }))
    const hex = await screen.findByRole('textbox', { name: 'Hex color' })
    await user.clear(hex)
    await user.type(hex, 'zzz{Enter}')

    expect(onChange).not.toHaveBeenCalled()
    expect(hex).toHaveAttribute('aria-invalid', 'true')
  })
})
