import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chip } from '../src/Chip'

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip label="Design" />)
    expect(screen.getByText('Design')).toBeInTheDocument()
  })

  it('applies the primary tint when selected', () => {
    render(<Chip label="Active filter" selected />)
    const chip = screen.getByText('Active filter')
    expect(chip.className).toContain('teal-u-bg-primary/10')
    expect(chip.className).toContain('teal-u-text-primary')
  })

  it('applies the primary tint for variant="primary"', () => {
    render(<Chip label="Featured" variant="primary" />)
    expect(screen.getByText('Featured').className).toContain('teal-u-bg-primary/10')
  })

  it('uses neutral styling by default', () => {
    render(<Chip label="Plain" />)
    const chip = screen.getByText('Plain')
    expect(chip.className).toContain('teal-u-bg-surface-container-high')
    expect(chip.className).not.toContain('teal-u-bg-primary/10')
  })

  it('renders a remove button that calls onRemove', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<Chip label="Archived" onRemove={onRemove} />)

    await user.click(screen.getByRole('button', { name: 'Remove Archived' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('disables the remove button when disabled', () => {
    render(<Chip label="Locked" onRemove={() => undefined} disabled />)
    expect(screen.getByRole('button', { name: 'Remove Locked' })).toBeDisabled()
  })

  it('renders no button without onRemove', () => {
    render(<Chip label="Static" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
