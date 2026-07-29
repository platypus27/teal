import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedControl } from '../src/SegmentedControl'

const options = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'calendar', label: 'Calendar', disabled: true },
]

describe('SegmentedControl', () => {
  it('renders the options with an accessible group name', () => {
    render(<SegmentedControl aria-label="Project view" options={options} />)

    const group = screen.getByRole('radiogroup', { name: 'Project view' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'List' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Calendar' })).toBeDisabled()
  })

  it('selects the first enabled option by default and renders the sliding pill', () => {
    const { container } = render(<SegmentedControl aria-label="Project view" options={options} />)

    const list = screen.getByRole('radio', { name: 'List' })
    expect(list).toHaveAttribute('aria-checked', 'true')
    expect(list).toHaveAttribute('data-state', 'on')
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('moves the selection on click', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SegmentedControl aria-label="Project view" options={options} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('radio', { name: 'Board' }))

    expect(onValueChange).toHaveBeenCalledWith('board')
    const board = screen.getByRole('radio', { name: 'Board' })
    expect(board).toHaveAttribute('aria-checked', 'true')
    expect(board).toHaveAttribute('data-state', 'on')
  })

  it('honors a controlled value', () => {
    render(<SegmentedControl aria-label="Project view" options={options} value="board" />)

    expect(screen.getByRole('radio', { name: 'Board' })).toHaveAttribute('data-state', 'on')
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('data-state', 'off')
  })
})
