import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimePicker } from '../src/TimePicker'

describe('TimePicker', () => {
  it('renders labelled hour and minute fields showing the value', () => {
    render(<TimePicker value="09:05" onChange={() => {}} />)

    expect(screen.getByRole('group', { name: 'Time' })).toBeInTheDocument()
    expect(screen.getByLabelText('Hour')).toHaveValue('09')
    expect(screen.getByLabelText('Minutes')).toHaveValue('05')
    expect(screen.queryByRole('button', { name: 'AM' })).not.toBeInTheDocument()
  })

  it('emits padded "HH:mm" values and clamps the minutes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TimePicker defaultValue="09:00" onChange={onChange} />)

    await user.type(screen.getByLabelText('Minutes'), '75')

    expect(onChange).toHaveBeenCalledWith('09:07')
    expect(onChange).toHaveBeenLastCalledWith('09:59')
    expect(screen.getByLabelText('Minutes')).toHaveValue('59')
  })

  it('clamps the hour at 23 in 24-hour mode', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TimePicker defaultValue="09:00" onChange={onChange} />)

    await user.type(screen.getByLabelText('Hour'), '99')

    expect(onChange).toHaveBeenLastCalledWith('23:00')
  })

  it('shows a 12-hour field with an AM/PM toggle when hourCycle is 12', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TimePicker value="14:30" hourCycle={12} onChange={onChange} />)

    expect(screen.getByLabelText('Hour')).toHaveValue('02')
    expect(screen.getByRole('button', { name: 'PM' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'AM' }))
    expect(onChange).toHaveBeenCalledWith('02:30')
  })
})
