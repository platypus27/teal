import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RangeSlider } from '../src/RangeSlider'

describe('RangeSlider', () => {
  it('renders two thumbs with per-thumb accessible names', () => {
    render(<RangeSlider label="Price range" defaultValue={[20, 80]} />)

    const low = screen.getByRole('slider', { name: 'Minimum value' })
    const high = screen.getByRole('slider', { name: 'Maximum value' })
    expect(low).toHaveAttribute('aria-valuenow', '20')
    expect(high).toHaveAttribute('aria-valuenow', '80')
    expect(low).toHaveAttribute('aria-valuemin', '0')
    expect(high).toHaveAttribute('aria-valuemax', '100')
  })

  it('moves a thumb with arrow keys and emits the tuple', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeSlider label="Price range" defaultValue={[20, 80]} onChange={onChange} />)

    screen.getByRole('slider', { name: 'Minimum value' }).focus()
    await user.keyboard('{ArrowRight}')

    expect(onChange).toHaveBeenCalledWith([21, 80])
  })

  it('moves the high thumb without disturbing the low thumb', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeSlider label="Price range" defaultValue={[20, 80]} onChange={onChange} />)

    screen.getByRole('slider', { name: 'Maximum value' }).focus()
    await user.keyboard('{ArrowLeft}')

    expect(onChange).toHaveBeenCalledWith([20, 79])
  })

  it('respects custom min, max, and step', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RangeSlider label="Years" min={2000} max={2030} step={5} defaultValue={[2010, 2020]} onChange={onChange} />,
    )

    const low = screen.getByRole('slider', { name: 'Minimum value' })
    expect(low).toHaveAttribute('aria-valuemin', '2000')
    expect(low).toHaveAttribute('aria-valuemax', '2030')
    low.focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith([2015, 2020])
  })

  it('supports custom thumb labels', () => {
    render(<RangeSlider label="Price range" thumbLabels={['From price', 'To price']} defaultValue={[10, 90]} />)

    expect(screen.getByRole('slider', { name: 'From price' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'To price' })).toBeInTheDocument()
  })

  it('renders the current range when showValue is set', () => {
    render(<RangeSlider label="Price range" defaultValue={[20, 80]} showValue />)

    expect(screen.getByText('20 – 80')).toBeInTheDocument()
  })

  it('reflects the controlled value', () => {
    render(<RangeSlider label="Price range" value={[30, 60]} onChange={() => {}} />)

    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute('aria-valuenow', '30')
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute('aria-valuenow', '60')
  })
})
