import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Slider } from '../src/Slider'

describe('Slider', () => {
  it('renders a labeled slider with min, max, and current value', () => {
    render(<Slider label="Storage quota" defaultValue={[40]} />)

    const slider = screen.getByRole('slider', { name: 'Storage quota' })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
    expect(slider).toHaveAttribute('aria-valuenow', '40')
  })

  it('connects its description to the thumb', () => {
    render(<Slider label="Storage quota" description="Applies to the whole workspace" defaultValue={[40]} />)

    expect(screen.getByRole('slider', { name: 'Storage quota' })).toHaveAccessibleDescription(
      'Applies to the whole workspace',
    )
  })

  it('renders the current value when showValue is set', () => {
    render(<Slider label="Storage quota" defaultValue={[40]} showValue />)

    expect(screen.getByText('40')).toBeInTheDocument()
  })

  it('changes the value with arrow keys', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Slider label="Storage quota" defaultValue={[40]} onValueChange={onValueChange} />)

    screen.getByRole('slider', { name: 'Storage quota' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenCalledWith([41])
  })

  it('respects custom min, max, and step', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Slider label="Reviewers" min={1} max={10} step={2} defaultValue={[3]} onValueChange={onValueChange} />,
    )

    const slider = screen.getByRole('slider', { name: 'Reviewers' })
    expect(slider).toHaveAttribute('aria-valuemin', '1')
    expect(slider).toHaveAttribute('aria-valuemax', '10')
    slider.focus()
    await user.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenCalledWith([5])
  })

  it('cannot be interacted with when disabled', () => {
    render(<Slider label="Storage quota" defaultValue={[40]} disabled />)

    expect(screen.getByRole('slider', { name: 'Storage quota' })).toHaveAttribute('data-disabled', '')
  })
})
